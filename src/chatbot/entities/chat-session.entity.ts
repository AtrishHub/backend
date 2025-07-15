import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { ChatHistory } from './chat-history.entity';

@Entity()
export class ChatSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column({ nullable: true })
  title: string;

  @Column()
  teamId: number;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => ChatHistory, history => history.session)
  messages: ChatHistory[];
}