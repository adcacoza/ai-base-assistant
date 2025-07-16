import { Document } from 'langchain/document';

export const loadDocumentsFromString = (content: string) => {
  return [new Document({ pageContent: content })];
};
