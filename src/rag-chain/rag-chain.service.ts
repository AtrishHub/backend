import { Injectable } from '@nestjs/common';
import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';


import { VectorStoreService } from 'src/vector-store/vector-store.service';
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents';
import { createRetrievalChain } from 'langchain/chains/retrieval';

@Injectable()
export class RagChainService {
  private readonly llm = new ChatOpenAI({ 
    model: 'gpt-4o-mini', 
    temperature: 0,
    streaming: true 
  });

  constructor(private readonly vectorStoreService: VectorStoreService) {}

  async getRetrievalChain(documentId: string) {
    const retriever = await this.vectorStoreService.asRetriever(documentId);

    const answerPrompt = PromptTemplate.fromTemplate(`
You are a helpful AI assistant that answers questions based on the provided context and conversation history. Use the following pieces of context and conversation history to answer the question at the end.

Document Context:
{context}

Conversation History:
{chat_history}

Current Question: {input}

Instructions:
- Answer the current question based on the document context provided
- Consider the conversation history to maintain context and avoid repetition
- If the document context doesn't contain enough information to answer the question, say so
- Be concise and accurate in your response
- If the question refers to previous parts of the conversation, acknowledge that context

Answer:`);

    const combineDocsChain = await createStuffDocumentsChain({
      llm: this.llm,
      prompt: answerPrompt,
    });

    return createRetrievalChain({
      retriever,
      combineDocsChain,
    });
  }
}