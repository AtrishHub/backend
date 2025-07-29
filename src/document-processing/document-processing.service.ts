import { Injectable } from '@nestjs/common';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { VectorStoreService } from 'src/vector-store/vector-store.service';
import { Document } from 'langchain/document';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DocumentProcessingService {
  constructor(private readonly vectorStoreService: VectorStoreService) {}

  async process(filePath: string, documentId: string, originalFilename: string, teamId?: string) {
    try {
      console.log(`Processing file: ${filePath} with documentId: ${documentId}`);
      
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
      }

      let docs: Document[] = [];
      const fileExtension = path.extname(originalFilename).toLowerCase();

      // Choose loader based on file type
      if (fileExtension === '.pdf') {
        const loader = new PDFLoader(filePath);
        docs = await loader.load();
      } else if (fileExtension === '.txt' || fileExtension === '.md') {
        const loader = new TextLoader(filePath);
        docs = await loader.load();
      } else {
        // For other file types, try to read as text
        const content = fs.readFileSync(filePath, 'utf-8');
        docs = [new Document({ pageContent: content, metadata: {} })];
      }

      console.log(`Loaded ${docs.length} documents from file`);

      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
      });
      const splitDocs = await splitter.splitDocuments(docs);

      console.log(`Split into ${splitDocs.length} chunks`);

      // Set documentId and teamId as top-level property for each document
      const documentsWithMetadata = splitDocs.map((doc) => ({
        pageContent: doc.pageContent,
        documentId, // for future-proofing if PGVectorStore supports it
        metadata: {
          documentId,
          teamId, // <-- Add teamId here
          originalFilename,
          filePath,
          ...doc.metadata,
        }
      }));

      console.log(`Adding ${documentsWithMetadata.length} documents to vector store`);
      await this.vectorStoreService.addDocuments(documentsWithMetadata);
      
      console.log(`Successfully processed and embedded document: ${originalFilename}`);
      
      return {
        success: true,
        documentId,
        teamId,
        originalFilename,
        chunksProcessed: documentsWithMetadata.length
      };
    } catch (error) {
      console.error('Error processing document:', error);
      throw new Error(`Failed to process document: ${error.message}`);
    }
  }
}