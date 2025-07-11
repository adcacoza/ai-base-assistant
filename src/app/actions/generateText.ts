'use server';

import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { mapApiError } from '@/lib/errorMapper';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateText(prompt: string): Promise<string> {
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
      // Si también falla Gemini, mapea y lanza error
      throw new Error(mapApiError(geminiError));
    }
  }
}
