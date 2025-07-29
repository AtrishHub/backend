import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { EmbeddingService } from './embedding.service';

@ApiTags('Embeddings')
@Controller('embeddings')
export class EmbeddingController {
  constructor(private readonly embeddingService: EmbeddingService) {}

  @Post('store')
  @ApiOperation({ summary: 'Store text embeddings' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        texts: {
          type: 'array',
          items: { type: 'string' },
          example: ['This is a sample text', 'Another sample text']
        },
        metadatas: {
          type: 'array',
          items: { type: 'object' },
          example: [{ source: 'doc1' }, { source: 'doc2' }]
        }
      }
    }
  })
  @ApiResponse({ status: 201, description: 'Embeddings stored successfully' })
  async storeEmbeddings(
    @Body() body: { texts: string[]; metadatas?: object[] }
  ) {
    const result = await this.embeddingService.storeEmbeddings(
      body.texts,
      body.metadatas || []
    );
    return {
      message: 'Embeddings stored successfully',
      count: body.texts.length
    };
  }

  @Get('search')
  @ApiOperation({ summary: 'Search similar embeddings' })
  @ApiResponse({ status: 200, description: 'Search results' })
  async searchSimilar(
    @Query('query') query: string,
    @Query('k') k: number = 5
  ) {
    const results = await this.embeddingService.searchSimilar(query, k);
    return {
      query,
      results: results.map(result => ({
        content: result.pageContent,
        metadata: result.metadata
      }))
    };
  }

  @Get('test')
  @ApiOperation({ summary: 'Test embedding functionality' })
  @ApiResponse({ status: 200, description: 'Test completed' })
  async testEmbeddings() {
    // Store some test embeddings
    const testTexts = [
      'NestJS is a progressive Node.js framework for building efficient, reliable, and scalable server-side applications.',
      'TypeScript is a strongly typed programming language that builds on JavaScript.',
      'PostgreSQL is a powerful, open source object-relational database system.',
      'Vector embeddings are numerical representations of text that capture semantic meaning.',
      'Machine learning models can understand context through vector similarity.'
    ];

    const testMetadatas = [
      { source: 'nestjs-docs', category: 'framework' },
      { source: 'typescript-docs', category: 'language' },
      { source: 'postgresql-docs', category: 'database' },
      { source: 'ai-docs', category: 'machine-learning' },
      { source: 'ml-docs', category: 'machine-learning' }
    ];

    await this.embeddingService.storeEmbeddings(testTexts, testMetadatas);

    // Search for similar content
    const searchResults = await this.embeddingService.searchSimilar('What is NestJS?', 3);

    return {
      message: 'Test embeddings stored and searched successfully',
      storedCount: testTexts.length,
      searchResults: searchResults.map(result => ({
        content: result.pageContent,
        metadata: result.metadata
      }))
    };
  }
} 