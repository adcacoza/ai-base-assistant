'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { getRetriever } from '@/lib/rag/retriever';
import { z } from 'zod';
import { createSafeAction } from '@/lib/withSafeAction';
import { type Document } from 'langchain/document';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const generateSchemaWithDoc = z.object({
  prompt: z.string().min(1, { message: 'El prompt no puede estar vacío.' }),
  document: z.string().min(1, { message: 'Debes subir un documento.' }),
});

export const generateTextWithRag = createSafeAction(
  generateSchemaWithDoc,
  async ({ prompt, document }) => {
    const retriever = await getRetriever(document);
    const relevantDocs = await retriever.getRelevantDocuments(prompt);
    const context = relevantDocs
      .map((doc: Document) => doc.pageContent)
      .join('\n');
    const newPrompt = `Contexto: ${context}\n\nPregunta: ${prompt}`;

    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL!,
    });
    const result = await model.generateContent(newPrompt);
    const response = await result.response;
    return response.text();
  },
);
