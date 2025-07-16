import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { embeddings } from './embeddings';
import { loadDocumentsFromString } from './loader';
import {
  RecursiveCharacterTextSplitter,
  type TextSplitter,
} from 'langchain/text_splitter';

export const getRetriever = async (documentContent: string) => {
  const docs = loadDocumentsFromString(documentContent);
  const textSplitter: TextSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const splits = await textSplitter.splitDocuments(docs);
  const vectorStore = await MemoryVectorStore.fromDocuments(splits, embeddings);
  return vectorStore.asRetriever();
};
