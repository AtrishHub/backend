import { Module } from '@nestjs/common';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { teams } from './entities/teams.entity';
import { TeamMember } from './entities/team-member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([teams, TeamMember])],
  controllers: [TeamsController],
  providers: [TeamsService],
})
export class TeamsModule {}
