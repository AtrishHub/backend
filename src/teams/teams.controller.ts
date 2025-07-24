import { Controller,Post,Body,Get, Req, UseGuards, Param, Delete, Patch, HttpException } from '@nestjs/common';
import { Request } from 'express';
import { CreateTeamDto } from './dto/create-teams.dto'; 
import { TeamsService } from './teams.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';


interface AuthRequest extends Request {
  user: { userId: number };
}
@ApiTags('Teams') 
@ApiBearerAuth() 
@Controller('teams')
export class TeamsController {

    constructor(private readonly teamsService: TeamsService) {}
    
  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Create a new team' })
  @ApiResponse({ status: 201, description: 'The team has been successfully created.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })

  async createTeam(@Body() createTeamDto: CreateTeamDto, @Req() req: Request) {
    const userId = String((req as any).user.sub);
    return this.teamsService.createTeam(createTeamDto, userId);
  }

  @Get()
@UseGuards(AuthGuard('jwt'))
@ApiOperation({ summary: 'Get all teams for the authenticated user' })
@ApiResponse({ status: 200, description: 'Successfully retrieved user\'s teams.' })
@ApiResponse({ status: 401, description: 'Unauthorized.' })
async getUserTeams(@Req() req: Request) {
    const userId = String((req as any).user.sub);
  return this.teamsService.getTeamsByUser(userId);
}

  @Get(':teamId/members')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get all members of a specific team' })
  @ApiParam({ name: 'teamId', description: 'The ID of the team', type: String })
  @ApiResponse({ status: 200, description: 'Successfully retrieved team members.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User is not a member of the team.' })
  async getTeamMembers(
    @Param('teamId') teamId: string,
    @Req() req: Request
  ) {
    const requesterId = String((req as any).user.sub);
    return this.teamsService.getTeamMembers(teamId, requesterId);
  }

  @Post(':teamId/members')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Add a new member to a team' })
  @ApiParam({ name: 'teamId', description: 'The ID of the team to add a member to' })
  @ApiBody({ 
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string', description: 'The ID of the user to add' }
      },
      example: {
        userId: 'cuid_of_user_to_add'
      }
    }
  })
  @ApiResponse({ status: 200, description: 'Member successfully added.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Only team owner can add members.' })
  async addMember(
    @Param('teamId') teamId: string,
    @Body('userId') userId: string,
    @Req() req: Request
  ) {
    const requesterId = String((req as any).user.sub);
    return this.teamsService.addMember(teamId, userId, requesterId);
  }

  @Delete(':teamId/members/:userId')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Remove a member from a team' })
  @ApiParam({ name: 'teamId', description: 'The ID of the team' })
  @ApiParam({ name: 'userId', description: 'The ID of the user to remove' })
  @ApiResponse({ status: 200, description: 'Member successfully removed.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Only team owner can remove members.' })
  async removeMember(
    @Param('teamId') teamId: string,
    @Param('userId') userId: string,
    @Req() req: Request
  ) {
    const requesterId = String((req as any).user.sub);
    return this.teamsService.removeMember(teamId, userId, requesterId);
  }

  @Patch(':teamId')
  @UseGuards(AuthGuard('jwt'))
   @ApiOperation({ summary: 'Update a team\'s name or description' })
  @ApiParam({ name: 'teamId', description: 'The ID of the team to update' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        teamName: { type: 'string', description: 'The new name of the team' },
        description: { type: 'string', description: 'The new description for the team' }
      },
      example: {
        teamName: 'New Awesome Team Name'
      }
    }
  })
  @ApiResponse({ status: 200, description: 'Team successfully updated.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden. You do not have permission to update this team.' })
  async updateTeam(
    @Param('teamId') teamId: string,
    @Body() body: { teamName?: string; description?: string },
    @Req() req: Request
  ) {
    const requesterId = String((req as any).user.sub);
    try {
      return await this.teamsService.updateTeam(teamId, requesterId, body);
    } catch (e) {
      throw new HttpException(e.message, 403);
    }
  }
}



