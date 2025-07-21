import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Folder } from '../../folder/entities/folder.entity';

@Entity('teams')
export class teams {
  @PrimaryGeneratedColumn('uuid')
  teamId: string;

  @Column({ type: 'varchar' })
  userId: string;

  @Column({ unique: true })
  teamName: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Folder, folder => folder.team)
  folders: Folder[];
}
  