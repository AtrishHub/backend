
import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DocumentsService } from './documents.service';
import { TeamMemberGuard } from './guards/team-member.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  getSchemaPath, 
} from '@nestjs/swagger'; 
import { Upload } from 'src/uploads/entities/upload.entity'; 


@ApiTags('Documents')
@ApiBearerAuth()
@Controller('documents')
@UseGuards(AuthGuard('jwt')) 
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get('team/:teamId')
  @ApiOperation({ summary: 'Get all documents for a specific team' })
  @ApiParam({
    name: 'teamId',
    type: 'string',
    description: 'The ID of the team to retrieve documents for',
  })
  // Instead of a DTO, we define the schema directly
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved team documents.',
    schema: {
      properties: {
        message: {
          type: 'string',
          example: 'Documents retrieved successfully.',
        },
        data: {
          type: 'array',
          items: { $ref: getSchemaPath(Upload) }, // Reference the Upload entity schema
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @UseGuards(TeamMemberGuard) 
  async getTeamDocuments(@Param('teamId') teamId: string) {
    const documents = await this.documentsService.findDocumentsByTeam(teamId);
    return {
      message: `Documents for team ${teamId} retrieved successfully.`,
      data: documents,
    };
  }
}