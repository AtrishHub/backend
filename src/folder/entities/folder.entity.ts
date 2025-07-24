import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn } from 'typeorm';
import { teams } from '../../teams/entities/teams.entity';
import { ChatSession } from '../../chatbot/entities/chat-session.entity';
// ChatSession will be updated to reference Folder, so import is omitted for now

@Entity('folders')
export class Folder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @ManyToOne(() => teams, team => team.folders, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'teamId' })
  team: teams;

  @Column()
  teamId: string;

  @ManyToOne(() => Folder, folder => folder.children, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parentId' })
  parent?: Folder;

  @Column({ nullable: true })
  parentId?: string;

  @OneToMany(() => Folder, folder => folder.parent)
  children: Folder[];

  @OneToMany(() => ChatSession, session => session.folder)
  sessions: ChatSession[];

  @CreateDateColumn()
  createdAt: Date;

  // Chat relation will be added after Chat entity is updated
} 