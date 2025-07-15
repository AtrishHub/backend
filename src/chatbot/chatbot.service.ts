// src/chatbot/chatbot.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatHistory } from './entities/chat-history.entity';
import { ChatSession } from './entities/chat-session.entity';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage } from '@langchain/core/messages';

@Injectable()
export class ChatbotService {
  private readonly llm: ChatOpenAI;

  constructor(
    @InjectRepository(ChatHistory)
    private readonly historyRepo: Repository<ChatHistory>,
    @InjectRepository(ChatSession)
    private readonly sessionRepo: Repository<ChatSession>,
  ) {
    this.llm = new ChatOpenAI({
      // model: 'tinyllama',
      // baseUrl: 'http://localhost:11434',
      openAIApiKey:  process.env.OPENAI_API_KEY,
      model:'gpt-4.1-mini',
    });
  }

  async startSession(userId: string, title?: string) {
    const session = this.sessionRepo.create({ userId, title });
    return this.sessionRepo.save(session);
  }

  async chat(userId: string, sessionId: string, message: string): Promise<string> {
    const session = await this.sessionRepo.findOne({ where: { id: sessionId } });
    if (!session) throw new NotFoundException('Session not found');

    const result = await this.llm.invoke([new HumanMessage({ content: message })]);
    const response = typeof result === 'string' ? result : result?.content;

    await this.historyRepo.save({
      userId,
      message: String(message),
      response: String(response),
      sessionId,
    });

    return typeof response === 'string' ? response : JSON.stringify(response);
  }

  async getSessions(userId: string) {
    return this.sessionRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async getMessages(sessionId: string) {
    return this.historyRepo.find({
      where: { sessionId },
      order: { timestamp: 'ASC' },
    });
  }
}
