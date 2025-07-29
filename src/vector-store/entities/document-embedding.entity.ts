import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
} from 'typeorm';

@Entity('document_embedding')
export class DocumentEmbedding {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  documentId: string;

  @Column('text')
  pageContent: string;

  @Column('text')
  embedding: string; // Store as text, will be converted to vector in database

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;
}
