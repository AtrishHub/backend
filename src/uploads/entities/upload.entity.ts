import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
  } from 'typeorm';
  
  import { ApiProperty } from '@nestjs/swagger';


  @Entity()
  export class Upload {
    @ApiProperty({
      description: 'The unique identifier for the upload record.',
      example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    })

    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @ApiProperty({
      description: 'The server path where the file is stored.',
      example: 'uploads/1678886400000-document.pdf',
    })
    @Column()
    filename: string;
  
    @ApiProperty({
      description: 'The server path where the file is stored.',
      example: 'uploads/1678886400000-document.pdf',
    })
    @Column()
    filepath: string;

    @ApiProperty({
      description: 'The MIME type of the file.',
      example: 'application/pdf',
    })
  
    @Column()
    mimetype: string;
  
    @ApiProperty({
      description: 'The ID of the team this file belongs to.',
      example: 't1e2a3m4-e5f6-7890-1234-567890abcdef',
    })
    @Column()
    teamId: string;
  
    @ApiProperty({
      description: 'The ID of the user who uploaded the file.',
      example: 'u1s2e3r4-e5f6-7890-1234-567890abcdef',
    })
    @Column()
    creatorId: string;
  
    @ApiProperty({
      description: 'The timestamp when the record was created.',
      example: '2025-07-24T12:30:00.000Z',
    })
    @CreateDateColumn()
    createdAt: Date;
  }