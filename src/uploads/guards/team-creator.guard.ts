import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    NotFoundException,
  } from '@nestjs/common';
  import { TeamsService } from 'src/teams/teams.service'; // Adjust path as needed
  
  @Injectable()
  export class TeamCreatorGuard implements CanActivate {
    constructor(private readonly teamsService: TeamsService) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const user = request.user; // Comes from your AuthGuard
      const teamId = request.body?.teamId || request.query?.teamId || request.params?.teamId;
      console.log('body:', request.body, 'query:', request.query, 'params:', request.params);
      if (!teamId) {
        // Or handle as a validation error
        throw new ForbiddenException('Team ID is missing.');
      }
  
      const team = await this.teamsService.findOneById(teamId);
  
      if (!team) {
        throw new NotFoundException('Team not found.');
      }
  
      // --- The Core Logic ---
      // Check if the authenticated user is the creator of the team.
      const creator = await this.teamsService['memberRepo'].findOne({ where: { teamId, userId: user.id, isCreator: true } });
      if (!creator) {
        throw new ForbiddenException(
          'Forbidden: Only the team creator can upload documents.',
        );
      }
  
      return true; // If we get here, the user is authorized.
    }
  }