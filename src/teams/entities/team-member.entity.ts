import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class TeamMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column() // references teams.teamId
  teamId: string;

  @Column()
  userId: string;

  @Column({ default: false })
  isCreator: boolean;
} 