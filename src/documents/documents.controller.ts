
import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DocumentsService } from './documents.service';
import { TeamMemberGuard } from './guards/team-member.guard';

@Controller('documents')
@UseGuards(AuthGuard('jwt')) 
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get('team/:teamId')
  @UseGuards(TeamMemberGuard) 
  async getTeamDocuments(@Param('teamId') teamId: string) {
    const documents = await this.documentsService.findDocumentsByTeam(teamId);
    return {
      message: `Documents for team ${teamId} retrieved successfully.`,
      data: documents,
    };
  }
}