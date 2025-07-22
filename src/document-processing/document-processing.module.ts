import { Module } from '@nestjs/common';
import { DocumentProcessingService } from './document-processing.service';

@Module({
  providers: [DocumentProcessingService],
  exports: [DocumentProcessingService],
})
export class DocumentProcessingModule {}