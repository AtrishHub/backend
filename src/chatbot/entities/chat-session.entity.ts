import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { ChatHistory } from './chat-history.entity';
import { Folder } from '../../folder/entities/folder.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class ChatSession {
  @ApiProperty({ description: 'Unique identifier for the session', example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'ID of the user who owns the session', example: 'user-123' })
  @Column()
  userId: string;

  @ApiProperty({ description: 'Title of the chat session', example: 'API Documentation Query', required: false })
  @Column({ nullable: true })
  title: string;

  @ApiProperty({ description: 'ID of the team associated with the session', example: 'team-456' })
  @Column()
  teamId: string;

  @ApiProperty({ description: 'ID of the folder containing the session', example: 'folder-789', required: false })
  @Column({ nullable: true })
  folderId?: string;

  @ManyToOne(() => Folder, folder => folder.sessions, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'folderId' })
  folder?: Folder;
  
  @ApiProperty({ description: 'Timestamp of session creation' })
  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => ChatHistory, history => history.session)
  messages: ChatHistory[];
}