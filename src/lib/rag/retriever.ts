import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { embeddings } from './embeddings';
import { loadDocumentsFromString } from './loader';
import {
  RecursiveCharacterTextSplitter,
  type TextSplitter,
} from 'langchain/text_splitter';
import { Document } from 'langchain/document';
import { type VectorStoreRetriever } from '@langchain/core/vectorstores';

class RetrieverBuilder {
  private documents: Document[];
  private textSplitter: TextSplitter;

  constructor() {
    this.documents = [];
    this.textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
  }

  public withDocuments(content: string): this {
    this.documents = loadDocumentsFromString(content);
    return this;
  }

  public withTextSplitter(splitter: TextSplitter): this {
    this.textSplitter = splitter;
    return this;
  }

  public async build(): Promise<VectorStoreRetriever<MemoryVectorStore>> {
    if (this.documents.length === 0) {
      throw new Error('No documents loaded to build the retriever.');
    }
    const splits = await this.textSplitter.splitDocuments(this.documents);
    const vectorStore = await MemoryVectorStore.fromDocuments(
      splits,
      embeddings,
    );
    return vectorStore.asRetriever();
  }
}

export const getRetriever = async (documentContent: string) => {
  return new RetrieverBuilder().withDocuments(documentContent).build();
};
