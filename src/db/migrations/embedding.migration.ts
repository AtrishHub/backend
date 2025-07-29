// src/db/migrations/embedding.migration.ts
import { Client } from 'pg';

export async function runEmbeddingMigration() {
  const client = new Client({
    connectionString: 'postgresql://admin:admin@localhost:5432/mydb',
  });

  await client.connect();

  await client.query(`
    CREATE EXTENSION IF NOT EXISTS vector;

    CREATE TABLE IF NOT EXISTS embeddings (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      content TEXT NOT NULL,
      metadata JSONB,
      embedding vector(1536) NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_embedding_vector
    ON embeddings USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
  `);

  console.log('✅ pgvector table created');
  await client.end();
} 