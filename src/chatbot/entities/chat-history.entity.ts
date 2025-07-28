// src/chatbot/entities/chat-history.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ChatSession } from './chat-session.entity';
import { ApiProperty } from '@nestjs/swagger';


@Entity()
export class ChatHistory {

  @ApiProperty({ description: 'Unique identifier for the chat message', example: 'b1c2d3e4-f5g6-7890-1234-567890abcdef' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'ID of the user who sent the message', example: 'user-123' })
  @Column()
  userId: string;

  @ApiProperty({ description: "The user's message text", example: 'What is NestJS?' })
  @Column('text')
  message: string;

  @ApiProperty({ description: 'The chatbot response text', example: 'NestJS is a progressive Node.js framework...' })
  @Column('text')
  response: string;

  @ApiProperty({ description: 'Timestamp of when the message was recorded' })
  @CreateDateColumn()
  timestamp: Date;

  @ApiProperty({ description: 'ID of the session this message belongs to', example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' })
  @Column()
  sessionId: string;

  @ApiProperty({ description: 'ID of the team associated with this message', example: 'team-456' })
  @Column()
  teamId: string;

  @ManyToOne(() => ChatSession, (session) => session.messages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sessionId' })
  session: ChatSession;
}
