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

This project requires several API keys to function. Create a file named `.env.local` in the root of the project and add the following lines, replacing the placeholder values with your actual keys.

**You will need keys from:**

- [OpenAI](https://platform.openai.com/api-keys)
- [Google AI Studio (Gemini)](https://aistudio.google.com/)
- [Clerk](https://dashboard.clerk.com/last-active?path=api-keys) (for user authentication)

```
# .env.local

# AI Provider Keys
OPENAI_API_KEY=your-openai-key
GEMINI_API_KEY=your-gemini-key

# Clerk Authentication Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

## How to Run This Project

You have two options to run this project. The recommended way is using Docker.

---

### Option 1: Running with Docker (Recommended)

This is the easiest way to get started. It runs the application in an isolated environment without needing to install Node.js or dependencies on your machine.

**Prerequisites:**

- [Docker](https://www.docker.com/get-started) must be installed and running.

**Steps:**

1.  **Configure API Keys:** Create the `.env.local` file as described in the [Configuration](#3-environment-variables) section.

2.  **Build the Docker Image:** You must pass the public Clerk key to the build command. This is because the key is needed to build the frontend part of the application.

    Get the `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` from your `.env.local` file and run the following command, replacing `your_clerk_publishable_key` with its value:

    ```bash
    docker build --build-arg NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key -t ai-base-assistant .
    ```

    _(This step does the `npm install` for you, inside the container)._

3.  **Run the Application:** Once the build is complete, run the following command:

    ```bash
    docker run -p 3000:3000 --env-file ./.env.local --name ai-assistant-container ai-base-assistant
    ```

4.  **Open the App:** Open [http://localhost:3000](http://localhost:3000) in your browser.

**To stop the application:**

```bash
docker stop ai-assistant-container
```

---

### Option 2: Running Manually (Without Docker)

Use this method if you prefer to manage the Node.js environment and dependencies yourself.

**Prerequisites:**

- [Node.js](https://nodejs.org/) (version 20 or higher recommended)
- `npm`

**Steps:**

1.  **Configure API Keys:** Create the `.env.local` file as described in the [Configuration](#3-environment-variables) section.

2.  **Install Dependencies:** Open your terminal and run:

    ```bash
    npm install --legacy-peer-deps
    ```

    _(The `--legacy-peer-deps` flag is necessary to avoid conflicts with some of the project's dependencies)._

3.  **Run the Development Server:**

    ```bash
    npm run dev
    ```

4.  **Open the App:** Open [http://localhost:3000](http://localhost:3000) in your browser.

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
