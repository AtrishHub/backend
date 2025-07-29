import { Injectable } from '@nestjs/common';
import { OpenAIEmbeddings } from '@langchain/openai';
import { PGVectorStore } from '@langchain/community/vectorstores/pgvector';
import { Pool } from 'pg';
import { Document } from 'langchain/document';

@Injectable()
export class VectorStoreService {
  private readonly embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  private getPool() {
    return new Pool({
      host: 'localhost',
      port: 5432,
      user: 'admin',
      password: 'admin',
      database: 'mydb',
    });
  }

  async addDocuments(documents: Document[]) {
    const pool = this.getPool();
    const vectorStore = await PGVectorStore.initialize(this.embeddings, {
      postgresConnectionOptions: {
        host: 'localhost',
        port: 5432,
        user: 'admin',
        password: 'admin',
        database: 'mydb',
      },
      tableName: 'document_embedding',
      columns: {
        idColumnName: "id",
        vectorColumnName: "embedding",
        contentColumnName: "pageContent",
        metadataColumnName: "metadata"
      },
    });

    return vectorStore.addDocuments(documents);
  }

  async asRetriever(documentId: string) {
    const vectorStore = await PGVectorStore.initialize(this.embeddings, {
      postgresConnectionOptions: {
        host: 'localhost',
        port: 5432,
        user: 'admin',
        password: 'admin',
        database: 'mydb',
      },
      tableName: 'document_embedding',
      columns: {
        idColumnName: "id",
        vectorColumnName: "embedding",
        contentColumnName: "pageContent",
        metadataColumnName: "metadata"
      },
    });

    if (documentId) {
      return vectorStore.asRetriever({
        filter: { documentId },
      });
    } else {
      return vectorStore.asRetriever();
    }
  }
}