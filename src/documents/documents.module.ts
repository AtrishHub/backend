import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { TeamMemberGuard } from './guards/team-member.guard';
import { Upload } from 'src/uploads/entities/upload.entity';
import { TeamMember } from '../teams/entities/team-member.entity';

@Module({
  imports: [
    // Make the database repositories for Upload and TeamMember available
    TypeOrmModule.forFeature([Upload, TeamMember]),
  ],
  controllers: [
    // Register the controller for this module
    DocumentsController,
  ],
  providers: [
    // Register the service and the guard as providers
    DocumentsService,
    TeamMemberGuard,
  ],
})
export class DocumentsModule {}