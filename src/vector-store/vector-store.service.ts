import { Injectable } from '@nestjs/common';
import { OpenAIEmbeddings } from '@langchain/openai';
import { PGVectorStore } from '@langchain/community/vectorstores/pgvector';
import { Pool } from 'pg';
import { Document } from 'langchain/document';

@Injectable()
export class VectorStoreService {
  private readonly vectorStore: PGVectorStore;
  private readonly embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  constructor() {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    this.vectorStore = new PGVectorStore(this.embeddings, {
      pool,
      tableName: 'document_embeddings', // Your vector table name
    });
  }

  async addDocuments(documents: Document[]) {
    return this.vectorStore.addDocuments(documents);
  }

  asRetriever(documentId: string) {
    return this.vectorStore.asRetriever({
      filter: { documentId },
    });
  }
}