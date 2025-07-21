'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SignedIn, SignedOut } from '@clerk/nextjs';
import Link from 'next/link';
import LoginPage from './login/page';

const Home = () => {
  return (
    <>
      <SignedIn>
        <main className="container mx-auto py-10 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Bienvenido a tu Asistente de IA
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Elige una herramienta para comenzar.
          </p>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Link href="/chat">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-2xl">
                    Asistente de Chat ✨
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Conversa con un asistente de IA para obtener respuestas,
                    generar texto y más.
                  </p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/rag">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-2xl">
                    Chat con Documentos (RAG) 📚
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Sube tus propios documentos y haz preguntas sobre su
                    contenido.
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </main>
      </SignedIn>
      <SignedOut>
        <LoginPage />
      </SignedOut>
    </>
  );
};

export default Home;
