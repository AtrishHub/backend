import { Controller,Post,Body,Get, Req, UseGuards, Param, Delete } from '@nestjs/common';
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

  @Post(':teamId/members')
  @UseGuards(AuthGuard('jwt'))
  async addMember(
    @Param('teamId') teamId: string,
    @Body('userId') userId: string,
    @Req() req: Request
  ) {
    const requesterId = String((req as any).user.sub);
    return this.teamsService.addMember(Number(teamId), userId, requesterId);
  }

  @Delete(':teamId/members/:userId')
  @UseGuards(AuthGuard('jwt'))
  async removeMember(
    @Param('teamId') teamId: string,
    @Param('userId') userId: string,
    @Req() req: Request
  ) {
    const requesterId = String((req as any).user.sub);
    return this.teamsService.removeMember(Number(teamId), userId, requesterId);
  }
}



