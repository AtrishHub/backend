// src/chatbot/chatbot.service.ts
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ChatHistory } from './entities/chat-history.entity';
import { ChatSession } from './entities/chat-session.entity';
import { ChatOpenAI } from '@langchain/openai';
import { AIMessage, HumanMessage } from '@langchain/core/messages';
import { TeamMember } from '../teams/entities/team-member.entity';
import { Readable } from 'stream';

@Injectable()
export class ChatbotService {
  private readonly llm: ChatOpenAI;

  constructor(
    @InjectRepository(ChatHistory)
    private readonly historyRepo: Repository<ChatHistory>,
    @InjectRepository(ChatSession)
    private readonly sessionRepo: Repository<ChatSession>,
    @InjectRepository(TeamMember)
    private readonly memberRepo: Repository<TeamMember>,
  ) {
    this.llm = new ChatOpenAI({
      openAIApiKey:  process.env.OPENAI_API_KEY,
      model:'gpt-4.1-mini',
    });
  }

  async startSession(userId: string, title: string | undefined, teamId: string) {
    // Check if user is a member of the team
    const isMember = await this.memberRepo.findOne({ where: { teamId, userId } });
    if (!isMember) throw new ForbiddenException('Not a member of this team');
    const session = this.sessionRepo.create({ userId, title, teamId });
    return this.sessionRepo.save(session);
  }
  async chat(userId: string, sessionId: string, message: string): Promise<string> {
    const session = await this.sessionRepo.findOne({ where: { id: sessionId } });
    if (!session) throw new NotFoundException('Session not found');
  
    // Check team membership
    const isMember = await this.memberRepo.findOne({ where: { teamId: session.teamId, userId } });
    if (!isMember) throw new ForbiddenException('Not a member of this team');
  
    // ✅ Fetch full session history (oldest to latest)
    const history = await this.historyRepo.find({
      where: { sessionId },
      order: { timestamp: 'ASC' },
    });
  
    // ✅ Format history into LangChain message array
    const contextMessages = history.flatMap((item) => {
      return [
        { role: 'user', content: item.message },
        { role: 'assistant', content: item.response },
      ];
    }).flatMap((msg) => {
      return msg.role === 'user'
        ? [new HumanMessage(msg.content)]
        : [new AIMessage(msg.content)];
    });
  
    // ✅ Add current user input
    contextMessages.push(new HumanMessage(message));
  
    // 🧠 Ask LLM with full context
    const result = await this.llm.invoke(contextMessages);
    const response = typeof result === 'string' ? result : result?.content;
  
    // 💾 Save both messages
    await this.historyRepo.save({
      userId,
      message: String(message),
      response: String(response),
      sessionId,
      teamId: session.teamId,
    });
  
    return typeof response === 'string' ? response : JSON.stringify(response);
  }
  // async chat(userId: string, sessionId: string, message: string): Promise<string> {
  //   const session = await this.sessionRepo.findOne({ where: { id: sessionId } });
  //   if (!session) throw new NotFoundException('Session not found');
  //   // Check if user is a member of the team for this session
  //   const isMember = await this.memberRepo.findOne({ where: { teamId: session.teamId, userId } });
  //   if (!isMember) throw new ForbiddenException('Not a member of this team');

  //   const result = await this.llm.invoke([new HumanMessage({ content: message })]);
  //   const response = typeof result === 'string' ? result : result?.content;

  //   await this.historyRepo.save({
  //     userId,
  //     message: String(message),
  //     response: String(response),
  //     sessionId,
  //     teamId: session.teamId,
  //   });

  //   return typeof response === 'string' ? response : JSON.stringify(response);
  // }

  // Streaming version for SSE endpoint
  async chatStream(userId: string, sessionId: string, message: string): Promise<Readable> {
    const response = await this.chat(userId, sessionId, message);
    // For demonstration, stream the full response as a single chunk
    const stream = new Readable({
      read() {
        this.push(JSON.stringify({ response }));
        this.push(null); // End the stream
      }
    });
    return stream;
  }

  async getSessions(userId: string) {
    // Return all sessions where the user is a member of the team
    const memberships = await this.memberRepo.find({ where: { userId } });
    const teamIds = memberships.map(m => m.teamId);
    if (teamIds.length === 0) return [];
    return this.sessionRepo.find({
      where: { teamId: In(teamIds) },
      order: { createdAt: 'DESC' },
    });
  }

  async getMessages(sessionId: string, userId: string) {
    const session = await this.sessionRepo.findOne({ where: { id: sessionId } });
    if (!session) throw new NotFoundException('Session not found');
    // Check if user is a member of the team for this session
    const isMember = await this.memberRepo.findOne({ where: { teamId: session.teamId, userId } });
    if (!isMember) throw new ForbiddenException('Not a member of this team');
    return this.historyRepo.find({
      where: { sessionId },
      order: { timestamp: 'ASC' },
    });
  }

  async getUserChatHistoryOrganized(userId: string) {
    // Fetch all sessions for the user, including team and folder
    const sessions = await this.sessionRepo.find({
      where: { userId },
      relations: ['folder', 'folder.team'],
    });
    // Group by team and folder
    const result = {};
    for (const session of sessions) {
      const teamId = session.teamId;
      const folderId = session.folderId || 'no-folder';
      if (!result[teamId]) result[teamId] = {};
      if (!result[teamId][folderId]) result[teamId][folderId] = [];
      result[teamId][folderId].push(session);
    }
    return result;
  }
}
