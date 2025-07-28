'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { createSafeAction } from '@/lib/withSafeAction';
import { z } from 'zod';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const generateSchema = z.object({
  prompt: z.string().min(1, { message: 'El prompt no puede estar vacío.' }),
});

export const generateText = createSafeAction(
  generateSchema,
  async ({ prompt }) => {
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL!,
    });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  },
);
