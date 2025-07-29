import { DataSource } from 'typeorm';
import { ChatHistory } from './chatbot/entities/chat-history.entity';
import { ChatSession } from './chatbot/entities/chat-session.entity';
import { teams } from './teams/entities/teams.entity';
import { TeamMember } from './teams/entities/team-member.entity';
import { Folder } from './folder/entities/folder.entity';
import { Upload } from './uploads/entities/upload.entity';
import { DocumentEmbedding } from './vector-store/entities/document-embedding.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),

  username: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'admin',
  database: process.env.DB_NAME || 'mydb',
  entities: [ChatHistory, ChatSession, teams, TeamMember,Folder,Upload,DocumentEmbedding],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
}); 