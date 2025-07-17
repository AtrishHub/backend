import { Injectable } from '@nestjs/common';
import { teams } from './entities/teams.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTeamDto } from './dto/create-teams.dto';
import { TeamMember } from './entities/team-member.entity';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(teams)
    private readonly teamRepo: Repository<teams>,
    @InjectRepository(TeamMember)
    private readonly memberRepo: Repository<TeamMember>,
  ) {}

  async createTeam(dto: CreateTeamDto) {
    const team = this.teamRepo.create(dto);
    const savedTeam = await this.teamRepo.save(team);
    // Add creator as first member
    await this.memberRepo.save({
      teamId: savedTeam.teamId, // now a number
      userId: dto.userId,
      isCreator: true,
    });
    return savedTeam;
  }

  async getTeamsByUser(userId: string) {
    // Find all team memberships for this user
    const memberships = await this.memberRepo.find({ where: { userId } });
    const teamIds = memberships.map(m => m.teamId);
    if (teamIds.length === 0) return [];
    // Find all teams where the user is a member
    const teamsList = await this.teamRepo.findByIds(teamIds);
    // Sort by createdAt descending
    return teamsList.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async addMember(teamId: number, userId: string, requesterId: string) {
    // Check if requester is creator
    const creator = await this.memberRepo.findOne({ where: { teamId, isCreator: true } });
    if (!creator || creator.userId !== requesterId) {
      throw new Error('Only the team creator can add members');
    }
    // Prevent duplicate members
    const existing = await this.memberRepo.findOne({ where: { teamId, userId } });
    if (existing) {
      throw new Error('User is already a member');
    }
    return this.memberRepo.save({ teamId, userId, isCreator: false });
  }

  async removeMember(teamId: number, userId: string, requesterId: string) {
    // Check if requester is creator
    const creator = await this.memberRepo.findOne({ where: { teamId, isCreator: true } });
    if (!creator || creator.userId !== requesterId) {
      throw new Error('Only the team creator can remove members');
    }
    // Prevent removing the creator
    if (creator.userId === userId) {
      throw new Error('Cannot remove the team creator');
    }
    const member = await this.memberRepo.findOne({ where: { teamId, userId } });
    if (!member) {
      throw new Error('User is not a member of the team');
    }
    return this.memberRepo.remove(member);
  }

  async getTeamMembers(teamId: number, requesterId: string) {
    // Check if requester is the creator
    const creator = await this.memberRepo.findOne({ where: { teamId, isCreator: true } });
    if (!creator || creator.userId !== requesterId) {
      throw new Error('Only the team creator can view members');
    }
    // Return all members
    return this.memberRepo.find({ where: { teamId } });
  }

  async updateTeam(teamId: number, requesterId: string, update: { teamName?: string; description?: string }) {
    // Check if requester is creator
    const creator = await this.memberRepo.findOne({ where: { teamId, isCreator: true } });
    if (!creator || creator.userId !== requesterId) {
      throw new Error('Only the team creator can update the team');
    }
    const team = await this.teamRepo.findOne({ where: { teamId } });
    if (!team) {
      throw new Error('Team not found');
    }
    if (update.teamName !== undefined) team.teamName = update.teamName;
    if (update.description !== undefined) team.description = update.description;
    return this.teamRepo.save(team);
  }
}

