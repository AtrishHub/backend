// src/embedding/embedding.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PGVectorStore } from '@langchain/community/vectorstores/pgvector';
import { OpenAIEmbeddings } from '@langchain/openai';
import { Pool } from 'pg';

@Injectable()
export class EmbeddingService implements OnModuleInit {
  private pool: Pool;

  async onModuleInit() {
    this.pool = new Pool({
      connectionString: 'postgresql://admin:admin@localhost:5432/mydb',
    });
  }

  async storeEmbeddings(texts: string[], metadatas: object[] = []) {
    const vectorStore = await PGVectorStore.fromTexts(
      texts,
      metadatas,
      new OpenAIEmbeddings(),
      {
        postgresConnectionOptions: {
          connectionString: 'postgresql://admin:admin@localhost:5432/mydb',
        },
        tableName: 'embeddings',
        columns: {
          idColumnName: 'id',
          vectorColumnName: 'embedding',
          contentColumnName: 'content',
          metadataColumnName: 'metadata',
        },
      },
    );

    return vectorStore;
  }

  async searchSimilar(query: string, k = 5) {
    const vectorStore = await PGVectorStore.initialize(
      new OpenAIEmbeddings(),
      {
        postgresConnectionOptions: {
          connectionString: 'postgresql://admin:admin@localhost:5432/mydb',
        },
        tableName: 'embeddings',
        columns: {
          idColumnName: 'id',
          vectorColumnName: 'embedding',
          contentColumnName: 'content',
          metadataColumnName: 'metadata',
        },
      },
    );

    const results = await vectorStore.similaritySearch(query, k);
    return results;
  }
} 