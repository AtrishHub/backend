import { Module } from '@nestjs/common';
import { RagChainService } from './rag-chain.service';
import { VectorStoreModule } from 'src/vector-store/vector-store.module';

@Module({
  imports: [VectorStoreModule],
  providers: [RagChainService],
  exports: [RagChainService],
})
export class RagChainModule {}