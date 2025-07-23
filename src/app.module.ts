import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { JwtStrategy } from './auth/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamsModule } from './teams/teams.module';
import { ChatHistory } from './chatbot/entities/chat-history.entity';
import { ChatSession } from './chatbot/entities/chat-session.entity';
import { teams } from './teams/entities/teams.entity';
import { ChatbotModule } from './chatbot/chatbot.module';
import { TeamMember } from './teams/entities/team-member.entity';
import { UserManagementModule } from './user-management/user-management.module';
import { FolderModule } from './folder/folder.module';
import { Folder } from './folder/entities/folder.entity';
import { UploadsModule } from './uploads/uploads.module';
import { DocumentsModule } from './documents/documents.module';
import { Upload } from './uploads/entities/upload.entity';
import { DocumentProcessingModule } from './document-processing/document-processing.module';
import { VectorStoreModule } from './vector-store/vector-store.module';
import { RagChainModule } from './rag-chain/rag-chain.module';
import { DocumentEmbedding } from './vector-store/entities/document-embedding.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes the ConfigService available globally
    }),
    AuthModule,
 ChatbotModule,TeamsModule,UserManagementModule,FolderModule,UploadsModule,DocumentsModule,RagChainModule,VectorStoreModule,DocumentProcessingModule,

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port:  5432,
      username: 'postgres',
      password: 'postgres',
      database:'chatbot',
      entities: [ ChatHistory,ChatSession, teams,TeamMember, Folder,Upload,DocumentEmbedding],
      synchronize: false,
    }),

    UserManagementModule,
    FolderModule,
    UploadsModule,
    DocumentsModule,
    DocumentProcessingModule,
    VectorStoreModule,
    RagChainModule,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}
