import { DataSource } from 'typeorm';
import { ChatHistory } from './chatbot/entities/chat-history.entity';
import { ChatSession } from './chatbot/entities/chat-session.entity';
import { teams } from './teams/entities/teams.entity';
import { TeamMember } from './teams/entities/team-member.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'chatbot',
  entities: [ChatHistory, ChatSession, teams, TeamMember],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
}); 