import { GenerateForm } from '@/components/forms/GenerateForm';
import { Card, CardContent } from '@/components/ui/card';

const Home = () => {
  return (
    <main className="container mx-auto py-10">
      <Card>
        <CardContent className="space-y-4">
          <h1 className="text-2xl font-bold">Generar texto ✨</h1>
          <GenerateForm />
        </CardContent>
      </Card>
    </main>
  );
};

export default Home;
