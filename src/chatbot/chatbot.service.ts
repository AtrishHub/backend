// src/chatbot/chatbot.service.ts
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ChatHistory } from './entities/chat-history.entity';
import { ChatSession } from './entities/chat-session.entity';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage } from '@langchain/core/messages';
import { TeamMember } from '../teams/entities/team-member.entity';

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

  async startSession(userId: string, title: string | undefined, teamId: number) {
    // Check if user is a member of the team
    const isMember = await this.memberRepo.findOne({ where: { teamId, userId } });
    if (!isMember) throw new ForbiddenException('Not a member of this team');
    const session = this.sessionRepo.create({ userId, title, teamId });
    return this.sessionRepo.save(session);
  }

  async chat(userId: string, sessionId: string, message: string): Promise<string> {
    const session = await this.sessionRepo.findOne({ where: { id: sessionId } });
    if (!session) throw new NotFoundException('Session not found');
    // Check if user is a member of the team for this session
    const isMember = await this.memberRepo.findOne({ where: { teamId: session.teamId, userId } });
    if (!isMember) throw new ForbiddenException('Not a member of this team');

    const result = await this.llm.invoke([new HumanMessage({ content: message })]);
    const response = typeof result === 'string' ? result : result?.content;

    await this.historyRepo.save({
      userId,
      message: String(message),
      response: String(response),
      sessionId,
      teamId: session.teamId,
    });

    return typeof response === 'string' ? response : JSON.stringify(response);
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
}
