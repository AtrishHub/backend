import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatbotService } from './chatbot.service';
import { ChatbotController } from './chatbot.controller';
import { ChatHistory } from './entities/chat-history.entity';
import { ChatSession } from './entities/chat-session.entity';
import { TeamMember } from '../teams/entities/team-member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChatHistory, ChatSession, TeamMember])],
  controllers: [ChatbotController],
  providers: [ChatbotService],
})
export class ChatbotModule {}