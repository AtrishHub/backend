import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
  } from 'typeorm';
  
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
  
    @CreateDateColumn()
    createdAt: Date;
  }
  