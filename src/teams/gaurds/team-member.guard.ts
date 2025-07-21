import {
    CanActivate,
    ExecutionContext,
    Injectable,
    ForbiddenException,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  import { Request } from 'express';
  import { TeamsService } from '../teams.service'; // your service
  
  @Injectable()
  export class TeamMemberGuard implements CanActivate {
    constructor(
      private readonly teamsService: TeamsService,
    ) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request: Request = context.switchToHttp().getRequest();
      const user = request.user; // should come from your JWT token
      const teamId = request.params.teamId || request.body.teamId;
  
      if (!teamId || !user?.sub) {
        throw new ForbiddenException('Missing team ID or user information');
      }
  
      const isMember = await this.teamsService.isUserMemberOfTeam(
        user.sub,
        teamId,
      );
  
      if (!isMember) {
        throw new ForbiddenException('You are not a member of this team');
      }
  
      return true;
    }
  }