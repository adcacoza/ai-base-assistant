import { Button } from '@/components/atoms/button';
import { Input } from '@/components/atoms/input';
import { ContactForm } from '@/components/contact-form/ContactForm';
import { FetchButton } from '@/components/example-fetch/FetchButton';
import { Card, CardContent } from '@/components/ui/card';

const Home = () => {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Bienvenida ✨</h2>
          <Input placeholder="Escribe algo..." />
          <Input disabled placeholder="Desactivado" />
          <Button className="mt-4">Enviar</Button>
        </CardContent>
      </Card>

      <div className="p-6">
        <h2 className="text-xl font-semibold mb-2">
          Ejemplo Server Action con formulario ✨
        </h2>
        <ContactForm />
        <FetchButton />
        <Card>
          <CardContent className="space-y-4">
            <h1 className="text-2xl font-bold">Colores de marca 🎨</h1>

            <div className="flex flex-wrap gap-4">
              <div className="bg-primary text-primary-foreground px-4 py-2 rounded">
                Primary
              </div>
              <div className="bg-secondary text-secondary-foreground px-4 py-2 rounded">
                Secondary
              </div>
              <div className="bg-accent text-accent-foreground px-4 py-2 rounded">
                Accent
              </div>
              <div className="bg-muted text-muted-foreground px-4 py-2 rounded">
                Muted
              </div>
            </div>

            <div className="flex gap-2 flex-wrap">
              <Button variant="default">Botón primario</Button>
              <Button variant="secondary">Botón secundario</Button>
              <Button variant="outline">Botón outline</Button>
              <Button variant="destructive">Botón destructivo</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Home;
