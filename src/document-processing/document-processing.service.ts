import { Injectable } from '@nestjs/common';

import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { VectorStoreService } from 'src/vector-store/vector-store.service';

@Injectable()
export class DocumentProcessingService {
  constructor(private readonly vectorStoreService: VectorStoreService) {}

  async process(filePath: string, documentId: string, originalFilename: string) {
    const loader = new PDFLoader(filePath);
    const docs = await loader.load();

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const splitDocs = await splitter.splitDocuments(docs);

    const documentsWithMetadata = splitDocs.map((doc) => {
      doc.metadata.documentId = documentId;
      doc.metadata.originalFilename = originalFilename;
      return doc;
    });

    await this.vectorStoreService.addDocuments(documentsWithMetadata);
  }
}