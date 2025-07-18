import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { TeamMember } from '../teams/entities/team-member.entity';
import { teams } from '../teams/entities/teams.entity';
import { Folder } from '../folder/entities/folder.entity';
import { ChatSession } from '../chatbot/entities/chat-session.entity';
import { ChatHistory } from '../chatbot/entities/chat-history.entity';

@Injectable()
export class UserManagementService {
  private domain = process.env.AUTH0_DOMAIN; 
  private clientId = process.env.AUTH0_CLIENT_ID;
  private clientSecret = process.env.AUTH0_CLIENT_SECRET;
  private audience = `https://${this.domain}/api/v2/`;

  constructor(
    @InjectRepository(TeamMember)
    private readonly teamMemberRepo: Repository<TeamMember>,
    @InjectRepository(teams)
    private readonly teamRepo: Repository<teams>,
    @InjectRepository(Folder)
    private readonly folderRepo: Repository<Folder>,
    @InjectRepository(ChatSession)
    private readonly chatSessionRepo: Repository<ChatSession>,
    @InjectRepository(ChatHistory)
    private readonly chatHistoryRepo: Repository<ChatHistory>,
  ) {}

  private async getManagementToken(): Promise<string> {
    const response = await axios.post(`https://${this.domain}/oauth/token`, {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      audience: this.audience,
      grant_type: 'client_credentials',
    });
    return response.data.access_token;
  }

  async getAllUsers(): Promise<any[]> {
    const token = await this.getManagementToken();
    const response = await axios.get(`${this.audience}users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }

  async getUserDashboard(userId: string) {
    // 1. Get all teams for the user
    const memberships = await this.teamMemberRepo.find({ where: { userId } });
    const teamIds = memberships.map(m => m.teamId);
    if (teamIds.length === 0) return [];
    const teamsList = await this.teamRepo.findByIds(teamIds);

    // 2. For each team, get folders and chat history
    const result: any[] = [];
    for (const team of teamsList) {
      // Get folders as a tree
      const roots = await this.folderRepo.find({ where: { teamId: team.teamId, parentId: IsNull() }, relations: ['children'] });
      const buildTree = async (folders: Folder[]): Promise<any[]> => {
        for (const folder of folders) {
          folder.children = await this.folderRepo.find({ where: { parentId: folder.id }, relations: ['children'] });
          // Get chat sessions for this user in this folder
          const sessions = await this.chatSessionRepo.find({ where: { folderId: folder.id, userId }, relations: ['folder'] });
          // For each session, get messages
          for (const session of sessions) {
            session['messages'] = await this.chatHistoryRepo.find({ where: { sessionId: session.id, userId } });
          }
          folder['chats'] = sessions;
          if (folder.children.length > 0) {
            folder.children = await buildTree(folder.children);
          }
        }
        return folders;
      };
      const folderTree = await buildTree(roots);

      // Get chat sessions for this user in this team not in any folder
      const chatsNoFolder = await this.chatSessionRepo.find({ where: { teamId: team.teamId, folderId: IsNull(), userId }, relations: ['folder'] });
      for (const session of chatsNoFolder) {
        session['messages'] = await this.chatHistoryRepo.find({ where: { sessionId: session.id, userId } });
      }

      result.push({
        teamId: team.teamId,
        teamName: team.teamName,
        description: team.description,
        createdAt: team.createdAt,
        folders: folderTree,
        chats: chatsNoFolder,
      });
    }
    return result;
  }
}
