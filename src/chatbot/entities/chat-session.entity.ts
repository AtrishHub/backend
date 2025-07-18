import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { ChatHistory } from './chat-history.entity';
import { Folder } from '../../folder/entities/folder.entity';

@Entity()
export class ChatSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  folderId?: number;

  @ManyToOne(() => Folder, folder => folder.sessions, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'folderId' })
  folder?: Folder;

  @Column()
  teamId: number;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => ChatHistory, history => history.session)
  messages: ChatHistory[];
}