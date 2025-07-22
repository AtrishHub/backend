import { Test, TestingModule } from '@nestjs/testing';
import { RagChainService } from './rag-chain.service';

describe('RagChainService', () => {
  let service: RagChainService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RagChainService],
    }).compile();

    service = module.get<RagChainService>(RagChainService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
