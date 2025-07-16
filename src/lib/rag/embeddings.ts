import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import 'dotenv/config';

export const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GEMINI_API_KEY,
  model: 'embedding-001',
});
