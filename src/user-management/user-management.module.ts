import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserManagementService } from './user-management.service';
import { UserManagementController } from './user-management.controller';
import { TeamMember } from '../teams/entities/team-member.entity';
import { teams } from '../teams/entities/teams.entity';
import { Folder } from '../folder/entities/folder.entity';
import { ChatSession } from '../chatbot/entities/chat-session.entity';
import { ChatHistory } from '../chatbot/entities/chat-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TeamMember, teams, Folder, ChatSession, ChatHistory])],
  controllers: [UserManagementController],
  providers: [UserManagementService],
  exports: [UserManagementService], 
})
export class UserManagementModule {}