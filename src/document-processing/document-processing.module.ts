import { Module } from '@nestjs/common';
import { DocumentProcessingService } from './document-processing.service';
import { VectorStoreModule } from 'src/vector-store/vector-store.module';

@Module({
  imports: [VectorStoreModule],
  providers: [DocumentProcessingService],
  exports: [DocumentProcessingService],
})
export class DocumentProcessingModule {}