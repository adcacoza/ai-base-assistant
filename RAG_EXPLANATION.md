# Explicación de la Implementación de RAG y la Tarjeta de Preguntas

Este documento detalla la implementación de la funcionalidad de Retrieval-Augmented Generation (RAG) y la interfaz de usuario para interactuar con modelos de lenguaje como ChatGPT o Gemini.

## 1. Flujo General de RAG

El proceso de RAG se puede dividir en los siguientes pasos:

1.  **Carga de Documentos**: Se carga un documento (por ejemplo, un archivo de texto) en la aplicación.
2.  **División de Texto**: El contenido del documento se divide en fragmentos más pequeños (chunks).
3.  **Creación de Embeddings**: Cada fragmento de texto se convierte en un vector numérico (embedding) que representa su significado semántico.
4.  **Almacenamiento en Vector Store**: Los embeddings se almacenan en una base de datos vectorial (Vector Store) para una búsqueda eficiente.
5.  **Búsqueda de Documentos Relevantes**: Cuando el usuario hace una pregunta (prompt), se busca en el Vector Store los fragmentos de texto más relevantes para esa pregunta.
6.  **Generación de Respuesta Aumentada**: Los fragmentos de texto relevantes se combinan con el prompt original para formar un nuevo prompt "aumentado". Este nuevo prompt se envía al modelo de lenguaje (Gemini) para generar una respuesta más precisa y contextualizada.

## 2. Implementación del Backend (RAG Pipeline)

La lógica del RAG se encuentra principalmente en el directorio `src/lib/rag` y `src/app/actions`.

### 2.1. Carga de Documentos (`src/lib/rag/loader.ts`)

Se utiliza la librería `langchain` para crear un objeto `Document` a partir del contenido de un string.

```typescript
// src/lib/rag/loader.ts
import { Document } from 'langchain/document';

export const loadDocumentsFromString = (content: string) => {
  return [new Document({ pageContent: content })];
};
```

### 2.2. Creación de Embeddings (`src/lib/rag/embeddings.ts`)

Se utiliza el modelo `embedding-001` de Google Generative AI para crear los embeddings. La clave de la API se carga desde las variables de entorno.

```typescript
// src/lib/rag/embeddings.ts
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import 'dotenv/config';

export const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GEMINI_API_KEY,
  model: 'embedding-001',
});
```

### 2.3. Almacenamiento en Vector Store (`src/lib/rag/vectorStore.ts`)

Se utiliza una `MemoryVectorStore` de `langchain`, que es una base de datos vectorial en memoria, simple para este caso de uso.

```typescript
// src/lib/rag/vectorStore.ts
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { embeddings } from './embeddings';

export const vectorStore = new MemoryVectorStore(embeddings);
```

### 2.4. Retriever (`src/lib/rag/retriever.ts`)

El retriever es el componente que orquesta la carga, división y almacenamiento de los documentos para prepararlos para la búsqueda.

1.  **Carga**: Llama a `loadDocumentsFromString`.
2.  **División**: Utiliza `RecursiveCharacterTextSplitter` para dividir el texto en chunks de 1000 caracteres con un solapamiento de 200 caracteres.
3.  **Almacenamiento**: Crea una `MemoryVectorStore` a partir de los chunks y los embeddings.
4.  **Retorno**: Devuelve un `retriever` que puede ser usado para buscar documentos.

```typescript
// src/lib/rag/retriever.ts
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { embeddings } from './embeddings';
import { loadDocumentsFromString } from './loader';
import {
  RecursiveCharacterTextSplitter,
  type TextSplitter,
} from 'langchain/text_splitter';

export const getRetriever = async (documentContent: string) => {
  const docs = loadDocumentsFromString(documentContent);
  const textSplitter: TextSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const splits = await textSplitter.splitDocuments(docs);
  const vectorStore = await MemoryVectorStore.fromDocuments(splits, embeddings);
  return vectorStore.asRetriever();
};
```

### 2.5. Server Action (`src/app/actions/generateTextWithRag.ts`)

Esta es la acción del servidor que se ejecuta cuando el usuario envía el formulario.

1.  **Validación**: Valida el prompt y el contenido del documento usando `zod`.
2.  **Obtener Retriever**: Llama a `getRetriever` con el contenido del documento.
3.  **Buscar Documentos Relevantes**: Usa el retriever para encontrar los documentos más relevantes para el prompt del usuario.
4.  **Crear Contexto**: Concatena el contenido de los documentos relevantes para formar un contexto.
5.  **Crear Nuevo Prompt**: Crea un nuevo prompt que incluye el contexto y la pregunta original.
6.  **Llamar al Modelo**: Llama al modelo de Gemini con el nuevo prompt para generar la respuesta.
7.  **Manejo de Errores**: Envuelve la lógica en un `try...catch` para manejar errores de la API de Gemini.

```typescript
// src/app/actions/generateTextWithRag.ts
'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { mapApiError } from '@/lib/errorMapper';
import { getRetriever } from '@/lib/rag/retriever';
import { withSafeAction } from '@/lib/withSafeAction';
import { z } from 'zod';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const generateSchemaWithDoc = z.object({
  prompt: z.string().min(1, { message: 'El prompt no puede estar vacío.' }),
  document: z.string().min(1, { message: 'Debes subir un documento.' }),
});

export const generateTextWithRag = withSafeAction(
  async (data: z.infer<typeof generateSchemaWithDoc>) => {
    // ... validación con zod ...
    const { prompt, document } = parsed.data;
    try {
      const retriever = await getRetriever(document);
      const relevantDocs = await retriever.getRelevantDocuments(prompt);
      const context = relevantDocs.map((doc) => doc.pageContent).join('\n');
      const newPrompt = `Contexto: ${context}\n\nPregunta: ${prompt}`;

      const model = genAI.getGenerativeModel({
        model: process.env.GEMINI_MODEL!,
      });
      const result = await model.generateContent(newPrompt);
      const response = await result.response;
      const text = response.text();
      return text;
    } catch (geminiError) {
      console.error('Error Gemini con RAG:', geminiError);
      throw new Error(mapApiError(geminiError));
    }
  },
);
```

## 3. Implementación del Frontend (UI Card)

La interfaz de usuario se implementa como un componente de React en `src/components/forms/GenerateFormWithRag.tsx`.

### 3.1. Estado y Hooks

- `useForm` de `react-hook-form` para manejar el estado del formulario y la validación con `zod`.
- `useTransition` para manejar el estado de carga mientras se ejecuta la server action.
- `useState` para almacenar el resultado, los errores y el historial.
- `useHistory` (un hook personalizado) para gestionar el historial de preguntas y respuestas.

### 3.2. Lógica del Formulario

- **`onSubmit`**: Esta función se llama cuando se envía el formulario.
  - Llama a la server action `generateTextWithRag` dentro de `startTransition`.
  - Maneja los casos de éxito y error, mostrando notificaciones (`toast`) al usuario.
  - Si tiene éxito, añade la pregunta y la respuesta al historial y muestra el resultado.
- **Manejo de Archivos**:
  - Un `<Input type="file" />` permite al usuario seleccionar un archivo `.txt` o `.pdf`.
  - El `onChange` del input lee el contenido del archivo.
  - Para archivos de texto, usa `FileReader`.
  - Para archivos PDF, envía el archivo a una API (`/api/parse-pdf`) que lo procesa en el servidor y devuelve el texto.
  - El contenido del texto se almacena en el estado del formulario usando `setValue`.

### 3.3. Renderizado

- Muestra un `LoadingSpinner` mientras la petición está pendiente (`isPending`).
- Muestra el resultado de la generación en un `div` estilizado.
- Muestra los errores en un `div` de alerta.
- Muestra el historial de conversaciones, con un botón para copiar cada respuesta y otro para borrar todo el historial.

```jsx
// src/components/forms/GenerateFormWithRag.tsx
'use client';

// ... imports ...

export const GenerateFormWithRag = () => {
  // ... hooks y estado ...

  const onSubmit = (data: GenerateInput) => {
    // ... lógica de envío ...
  };

  const handleCopy = (text: string | null) => {
    // ... lógica de copiado ...
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        type="file"
        accept=".txt,.pdf"
        onChange={async (e) => {
          // ... lógica de lectura de archivo ...
        }}
      />
      <Input
        placeholder="Escribe un prompt para el RAG..."
        disabled={isPending}
        {...register('prompt')}
      />
      {/* ... resto del JSX ... */}
    </form>
  );
};
```

Esta estructura combina la potencia de las Server Actions de Next.js para la lógica de backend con un frontend reactivo y amigable construido con React, `react-hook-form` y `zod`.
