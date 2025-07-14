'use server';

import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { mapApiError } from '@/lib/errorMapper';
import { promptSchema } from '@/lib/validation/promptSchema';
import { withSafeAction } from '@/lib/withSafeAction';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

//server validation
export const generateText = withSafeAction(async (rawPrompt: string) => {
  const parsed = promptSchema.safeParse({ prompt: rawPrompt });
  if (!parsed.success) {
    const message = parsed.error.errors[0]?.message ?? 'Datos inválidos.';
    throw new Error(message);
  }

  const prompt = parsed.data.prompt;
  // first try openia
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Eres un asistente útil que responde de forma clara.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    return completion.choices[0].message.content ?? 'Sin respuesta.';
  } catch (openaiError) {
    console.warn('OpenAI falló, intentando Gemini...');
    console.error('Error OpenAI:', openaiError);
    // if OpenAI fail, call Gemini
    try {
      const model = genAI.getGenerativeModel({
        model: process.env.GEMINI_MODEL!,
      });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      return text;
    } catch (geminiError) {
      console.error('Error Gemini:', geminiError);
      throw new Error(mapApiError(geminiError));
    }
  }
});
