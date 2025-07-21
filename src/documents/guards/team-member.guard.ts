import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
  import { TeamMember } from 'src/teams/entities/team-member.entity';
  
  @Injectable()
  export class TeamMemberGuard implements CanActivate {
    constructor(
      @InjectRepository(TeamMember)
      private teamMemberRepository: Repository<TeamMember>,
    ) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const user = request.user; 
      const teamId = request.params.teamId;
  
      if (!user || !teamId) {
        throw new ForbiddenException('Access Denied');
      }
  
      const membership = await this.teamMemberRepository.findOne({
        where: { userId: user.id, teamId },
      });
  
      if (!membership) {
        throw new ForbiddenException(
          'You are not a member of this team.',
        );
      }
  
      return true; 
    }
  }