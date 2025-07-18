import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    OneToMany,
  } from 'typeorm';
  import { Folder } from '../../folder/entities/folder.entity';
  
  @Entity('teams')
  export class teams {
    @PrimaryGeneratedColumn()
    teamId: number;
  
    @Column({ type: 'varchar' })
    userId: string;
  
    @Column({ unique: true })
    teamName: string;
    
  
    @Column({ type: 'text', nullable: true })
    description?: string;
  
    @OneToMany(() => Folder, folder => folder.team)
    folders: Folder[];
  
    @CreateDateColumn()
    createdAt: Date;
  }
  