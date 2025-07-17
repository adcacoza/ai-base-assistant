import { GenerateForm } from '@/components/forms/GenerateForm';
import { GenerateFormWithRag } from '@/components/forms/GenerateFormWithRag';
import { Card, CardContent } from '@/components/ui/card';
import { SignedIn, SignedOut } from '@clerk/nextjs';
import LoginPage from './login/page';

const Home = () => {
  return (
    <>
      <SignedIn>
        <main className="container mx-auto py-10 grid md:grid-cols-2 gap-8">
          <Card>
            <CardContent className="space-y-4 pt-6">
              <h1 className="text-2xl font-bold">Generar texto ✨</h1>
              <GenerateForm />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-4 pt-6">
              <h1 className="text-2xl font-bold">Generar texto con RAG 📚</h1>
              <GenerateFormWithRag />
            </CardContent>
          </Card>
        </main>
      </SignedIn>
      <SignedOut>
        <LoginPage />
      </SignedOut>
    </>
  );
};

export default Home;
