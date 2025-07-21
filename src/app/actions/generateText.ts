'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { mapApiError } from '@/lib/errorMapper';
import { promptSchema } from '@/lib/validation/promptSchema';
// import { withSafeAction } from '@/lib/withSafeAction';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

//server validation
export const generateText = async (rawPrompt: string) => {
  const parsed = promptSchema.safeParse({ prompt: rawPrompt });
  if (!parsed.success) {
    const message =
      parsed.error.errors[0]?.message ?? 'El prompt no puede estar vacío.';

    return { success: false, error: message };
  }

  const prompt = parsed.data.prompt;
  try {
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL!,
    });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return { success: true, data: response.text() };
  } catch (geminiError) {
    console.error('Error Gemini:', geminiError);
    return { success: false, error: mapApiError(geminiError) };
  }
};
