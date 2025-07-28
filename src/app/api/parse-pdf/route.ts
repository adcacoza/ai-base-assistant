import { NextResponse } from 'next/server';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No se ha subido ningún archivo.' },
        { status: 400 },
      );
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'El archivo debe ser un PDF.' },
        { status: 400 },
      );
    }

    const loader = new PDFLoader(file);
    const docs = await loader.load();
    const text = docs.map((doc) => doc.pageContent).join('\n');

    return NextResponse.json({ text });
  } catch (error) {
    console.error('[PDF Parse Error]', error);
    return NextResponse.json(
      { error: 'Error al procesar el archivo PDF.' },
      { status: 500 },
    );
  }
}
