This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Configuration

This project uses the OpenAI and Google Gemini APIs to generate text. To use these features, you need to create API keys for both services and configure them in the project.

### 1. OpenAI API Key

1.  Go to the [OpenAI website](https://platform.openai.com/) and create an account or log in.
2.  Navigate to the [API keys](https://platform.openai.com/api-keys) section.
3.  Click on "Create new secret key" and give it a name.
4.  Copy the generated key.

### 2. Google Gemini API Key

1.  Go to [Google AI Studio](https://aistudio.google.com/) and log in with your Google account.
2.  Click on "Get API key" and then "Create API key in new project".
3.  Copy the generated key.

**Important Note:** In Google AI Studio, make sure to check the model name that is available to you. You may need to update the model name in the code (`src/app/actions/generateText.ts`) to match the one you have access to, otherwise you may get an error.

### 3. Environment Variables

Once you have both keys, create a file named `.env.local` in the root of the project and add the following lines, replacing `your-key` with the keys you obtained:

```
OPENAI_API_KEY=your-openai-key
GEMINI_API_KEY=your-gemini-key
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
