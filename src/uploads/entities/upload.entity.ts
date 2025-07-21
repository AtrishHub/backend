import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
  } from 'typeorm';
  
  @Entity()
  export class Upload {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column()
    filename: string;
  
    @Column()
    filepath: string;
  
    @Column()
    mimetype: string;
  
    @Column()
    teamId: string;
  
    @Column()
    creatorId: string;
  
    @CreateDateColumn()
    createdAt: Date;
  }