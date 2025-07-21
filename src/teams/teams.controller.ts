import { Controller,Post,Body,Get, Req, UseGuards, Param, Delete, Patch, HttpException } from '@nestjs/common';
import { Request } from 'express';
import { CreateTeamDto } from './dto/create-teams.dto'; 
import { TeamsService } from './teams.service';
import { AuthGuard } from '@nestjs/passport';

interface AuthRequest extends Request {
  user: { userId: number };
}

@Controller('teams')
export class TeamsController {

    constructor(private readonly teamsService: TeamsService) {}
    
  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createTeam(@Body() createTeamDto: CreateTeamDto, @Req() req: Request) {
    console.log('Authorization header:', req.headers['authorization']);
    console.log('req.user:', (req as any).user);
    // Extract userId from JWT payload's sub claim
    const userId = String((req as any).user.sub);
    return this.teamsService.createTeam({ ...createTeamDto, userId });
  }

  @Get()
@UseGuards(AuthGuard('jwt'))
async getUserTeams(@Req() req: Request) {
    // Extract userId from JWT payload's sub claim
    const userId = String((req as any).user.sub);
  return this.teamsService.getTeamsByUser(userId);
}

  @Get(':teamId/members')
  @UseGuards(AuthGuard('jwt'))
  async getTeamMembers(
    @Param('teamId') teamId: string,
    @Req() req: Request
  ) {
    const requesterId = String((req as any).user.sub);
    return this.teamsService.getTeamMembers(teamId, requesterId);
  }

  @Post(':teamId/members')
  @UseGuards(AuthGuard('jwt'))
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



