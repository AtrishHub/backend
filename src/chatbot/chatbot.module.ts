import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatbotService } from './chatbot.service';
import { ChatbotController } from './chatbot.controller';
import { ChatHistory } from './entities/chat-history.entity';
import { ChatSession } from './entities/chat-session.entity';
import { TeamMember } from '../teams/entities/team-member.entity';
import { RagChainModule } from 'src/rag-chain/rag-chain.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatHistory, ChatSession, TeamMember]),
    RagChainModule,
  ],
  controllers: [ChatbotController],
  providers: [ChatbotService],
})
export class ChatbotModule {}