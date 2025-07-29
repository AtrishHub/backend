import { Injectable } from '@nestjs/common';
import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { RunnableSequence } from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { formatDocumentsAsString } from 'langchain/util/document';
import { VectorStoreService } from 'src/vector-store/vector-store.service';
import { createHistoryAwareRetriever } from 'langchain/chains/history_aware_retriever';
import { MessagesPlaceholder } from '@langchain/core/prompts';
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents';
import { createRetrievalChain } from 'langchain/chains/retrieval';

@Injectable()
export class RagChainService {
  private readonly llm = new ChatOpenAI({ model: 'gpt-4o', temperature: 0 });

  constructor(private readonly vectorStoreService: VectorStoreService) {}

  async getRetrievalChain(documentId: string) {
    const retriever = await this.vectorStoreService.asRetriever(documentId);

    const historyAwarePrompt = PromptTemplate.fromTemplate(`...`); // Add your history-aware prompt here
    const historyAwareRetrieverChain = await createHistoryAwareRetriever({
      llm: this.llm,
      retriever,
      rephrasePrompt: historyAwarePrompt,
    });

    const answerPrompt = PromptTemplate.fromTemplate(`...`); // Add your answer prompt here
    const combineDocsChain = await createStuffDocumentsChain({
      llm: this.llm,
      prompt: answerPrompt,
    });

    return createRetrievalChain({
      retriever: historyAwareRetrieverChain,
      combineDocsChain,
    });
  }
}