import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { VectorStoreService } from './vector-store.service';
import { Document } from 'langchain/document';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentEmbedding } from './entities/document-embedding.entity';

@ApiTags('Vector Store')
@Controller('vector-store')
export class VectorStoreController {
  constructor(
    private readonly vectorStoreService: VectorStoreService,
    @InjectRepository(DocumentEmbedding)
    private readonly documentEmbeddingRepo: Repository<DocumentEmbedding>
  ) {}

  @Get('debug-table')
  @ApiOperation({ summary: 'Debug table structure' })
  @ApiResponse({ status: 200, description: 'Table structure info' })
  async debugTable() {
    try {
      // Try to get table structure
      const result = await this.documentEmbeddingRepo.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'document_embedding'
        ORDER BY ordinal_position;
      `);
      
      return {
        message: 'Table structure retrieved',
        columns: result
      };
    } catch (error) {
      return {
        message: 'Error getting table structure',
        error: error.message
      };
    }
  }

  @Post('add-documents')
  @ApiOperation({ summary: 'Add documents to vector store' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        documents: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              pageContent: { type: 'string' },
              metadata: { type: 'object' }
            }
          },
          example: [
            {
              pageContent: 'NestJS is a progressive Node.js framework for building efficient applications.',
              metadata: { documentId: 'doc1', source: 'nestjs-docs' }
            }
          ]
        }
      }
    }
  })
  @ApiResponse({ status: 201, description: 'Documents added successfully' })
  async addDocuments(
    @Body() body: { documents: { pageContent: string; metadata: any }[] }
  ) {
    const documents = body.documents.map(doc => 
      new Document({ pageContent: doc.pageContent, metadata: doc.metadata })
    );
    
    const result = await this.vectorStoreService.addDocuments(documents);
    
    return {
      message: 'Documents added to vector store successfully',
      count: documents.length
    };
  }
   
  @Get('search')
  @ApiOperation({ summary: 'Search similar documents' })
  @ApiResponse({ status: 200, description: 'Search results' })
  async searchSimilar(
    @Query('query') query: string,
    @Query('documentId') documentId?: string,
    @Query('k') k: number = 4
  ) {
    const retriever = await this.vectorStoreService.asRetriever(documentId || '');
    const results = await retriever.getRelevantDocuments(query);
    
    return {
      query,
      documentId,
      results: results.map(result => ({
        content: result.pageContent,
        metadata: result.metadata
      }))
    };
  }

  @Get('test')
  @ApiOperation({ summary: 'Test vector store functionality' })
  @ApiResponse({ status: 200, description: 'Test completed' })
  async testVectorStore() {
    // Test documents
    const testDocuments = [
      new Document({
        pageContent: 'NestJS is a progressive Node.js framework for building efficient, reliable, and scalable server-side applications.',
        metadata: { documentId: 'test-doc-1', source: 'nestjs-docs', category: 'framework' }
      }),
      new Document({
        pageContent: 'TypeScript is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.',
        metadata: { documentId: 'test-doc-2', source: 'typescript-docs', category: 'language' }
      }),
      new Document({
        pageContent: 'PostgreSQL is a powerful, open source object-relational database system with over 30 years of active development.',
        metadata: { documentId: 'test-doc-3', source: 'postgresql-docs', category: 'database' }
      }),
      new Document({
        pageContent: 'Vector embeddings are numerical representations of text that capture semantic meaning for machine learning applications.',
        metadata: { documentId: 'test-doc-4', source: 'ai-docs', category: 'machine-learning' }
      })
    ];

    // Add documents to vector store
    await this.vectorStoreService.addDocuments(testDocuments);

    // Test search
    const retriever = await this.vectorStoreService.asRetriever('test-doc-1');
    const searchResults = await retriever.getRelevantDocuments('What is NestJS?');

    return {
      message: 'Vector store test completed successfully',
      storedCount: testDocuments.length,
      searchResults: searchResults.map(result => ({
        content: result.pageContent,
        metadata: result.metadata
      }))
    };
  }

  @Get('test-all-documents')
  @ApiOperation({ summary: 'Test search across all documents' })
  @ApiResponse({ status: 200, description: 'Test completed' })
  async testAllDocuments() {
    // First add some test documents
    const testDocuments = [
      new Document({
        pageContent: 'NestJS is a progressive Node.js framework for building efficient, reliable, and scalable server-side applications.',
        metadata: { documentId: 'all-doc-1', source: 'nestjs-docs', category: 'framework' }
      }),
      new Document({
        pageContent: 'TypeScript is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.',
        metadata: { documentId: 'all-doc-2', source: 'typescript-docs', category: 'language' }
      }),
      new Document({
        pageContent: 'PostgreSQL is a powerful, open source object-relational database system with over 30 years of active development.',
        metadata: { documentId: 'all-doc-3', source: 'postgresql-docs', category: 'database' }
      })
    ];

    await this.vectorStoreService.addDocuments(testDocuments);

    // Test search without documentId filter (searches all documents)
    const retriever = await this.vectorStoreService.asRetriever('');
    const searchResults = await retriever.getRelevantDocuments('What is TypeScript?');

    return {
      message: 'All documents search test completed',
      storedCount: testDocuments.length,
      searchResults: searchResults.map(result => ({
        content: result.pageContent,
        metadata: result.metadata
      }))
    };
  }

  @Get('simple-test')
  @ApiOperation({ summary: 'Simple test with one document' })
  @ApiResponse({ status: 200, description: 'Test completed' })
  async simpleTest() {
    try {
      // Test with just one document
      const testDocument = new Document({
        pageContent: 'NestJS is a progressive Node.js framework.',
        metadata: { documentId: 'simple-test-1', source: 'test' }
      });

      await this.vectorStoreService.addDocuments([testDocument]);

      return {
        message: 'Simple test completed successfully',
        success: true
      };
    } catch (error) {
      return {
        message: 'Simple test failed',
        error: error.message,
        stack: error.stack
      };
    }
  }
} 