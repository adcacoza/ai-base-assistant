'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { mapApiError } from '@/lib/errorMapper';
import { getRetriever } from '@/lib/rag/retriever';
import { z } from 'zod';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const generateSchemaWithDoc = z.object({
  prompt: z.string().min(1, { message: 'El prompt no puede estar vacío.' }),
  document: z.string().min(1, { message: 'Debes subir un documento.' }),
});

export const generateTextWithRag = async (
  data: z.infer<typeof generateSchemaWithDoc>,
) => {
  const parsed = generateSchemaWithDoc.safeParse(data);
  if (!parsed.success) {
    const message =
      parsed.error.errors[0]?.message ?? 'Datos de entrada no válidos.';
    return { success: false, error: message };
  }

  const { prompt, document } = parsed.data;
  try {
    const retriever = await getRetriever(document);
    const relevantDocs = await retriever.getRelevantDocuments(prompt);
    const context = relevantDocs.map((doc) => doc.pageContent).join('\n');
    const newPrompt = `Contexto: ${context}\n\nPregunta: ${prompt}`;

    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL!,
    });
    const result = await model.generateContent(newPrompt);
    const response = await result.response;
    return { success: true, data: response.text() };
  } catch (geminiError) {
    console.error('Error Gemini con RAG:', geminiError);
    return { success: false, error: mapApiError(geminiError) };
  }
};
