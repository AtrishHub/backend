import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VectorStoreService } from './vector-store.service';
import { DocumentEmbedding } from './entities/document-embedding.entity';
import { VectorStoreController } from './vector-store.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DocumentEmbedding])],
  controllers: [VectorStoreController],
  providers: [VectorStoreService],
  exports: [VectorStoreService],
})
export class VectorStoreModule {}
