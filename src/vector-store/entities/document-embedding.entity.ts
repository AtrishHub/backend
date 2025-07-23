import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity()
export class DocumentEmbedding {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  documentId: string; // Foreign key to your Upload entity

  @Column('text')
  pageContent: string;
  
  // This column will store your vector embeddings.
  // The `1536` should match the dimensions of your embedding model (e.g., OpenAI's text-embedding-3-small).
  @Column({ type: 'float8', array: true })
  embedding: number[];

  @Column('jsonb')
  metadata: object;
}