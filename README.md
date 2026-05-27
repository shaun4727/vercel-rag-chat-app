# Next.js Private RAG Platform 🚀

A production-grade, full-stack Retrieval-Augmented Generation (RAG) application built with Next.js. This platform allows authenticated users to securely ingest private text documents, generate vector embeddings, and chat intelligently with their own knowledge base using Google's Gemini models.

## 📖 What This Project Does

This application solves the problem of querying private data using Large Language Models (LLMs). Instead of relying on an LLM's public training data, this app:

1. **Secures Access:** Authenticates users via GitHub.
2. **Ingests Data:** Accepts text input and converts it into high-dimensional vector embeddings using Google's Gemini Embedding model.
3. **Stores Vectors:** Saves the embeddings directly into a PostgreSQL database using the `pgvector` extension.
4. **Retrieves & Generates:** When a user asks a question, the app converts the question into a vector, performs a mathematical similarity search in the database to find the most relevant documents, and feeds that specific context to `gemini-2.5-flash` to generate a precise, context-aware answer.

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router, Server Actions)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **AI Integration:** [Vercel AI SDK v5](https://sdk.vercel.ai/docs)
- **LLM & Embeddings:** Google Gemini (`gemini-2.5-flash`, `gemini-embedding-001`)
- **Database:** PostgreSQL with [`pgvector`](https://github.com/pgvector/pgvector) extension
- **ORM:** [Prisma](https://www.prisma.io/) (v7 compatible via `@prisma/adapter-pg`)
- **Authentication:** [Auth.js v5](https://authjs.dev/) (NextAuth Beta) - GitHub Provider
- **Styling & UI:** [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/)
- **Package Manager:** [pnpm](https://pnpm.io/)

---

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites

1. **Node.js** (v18+ recommended)
2. **pnpm** installed (`npm install -g pnpm`)
3. **PostgreSQL** running locally or hosted, with the `pgvector` extension installed.
   _(e.g., for Ubuntu/Debian: `sudo apt-get install postgresql-16-pgvector` then `sudo systemctl restart postgresql`)_

### 1. Clone the Repository

```bash
git clone [https://github.com/your-username/rag-chatbot.git](https://github.com/your-username/rag-chatbot.git)
cd rag-chatbot

```

### 2. Install Dependencies

```bash
pnpm install

```

### 3. Environment Variables

Create a `.env` file at the root of the project and populate it with your credentials:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/rag_vercel_ai_db?schema=public"

# AI Provider (Google)
GOOGLE_GENERATIVE_AI_API_KEY="your-google-gemini-api-key"

# Auth.js (NextAuth)
AUTH_SECRET="your-generated-secret-here" # Generate via: openssl rand -base64 32
AUTH_GITHUB_ID="your_github_oauth_app_id"
AUTH_GITHUB_SECRET="your_github_oauth_app_secret"

```

### 4. Database Setup

Ensure your PostgreSQL database is completely empty before running migrations to avoid vector dimension mismatches.

Generate the Prisma Client and run migrations to create the tables and enable the `vector` extension:

```bash
pnpm exec prisma generate
pnpm exec prisma migrate dev --name init_db

```

### 5. Run the Development Server

```bash
pnpm dev

```

Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) in your browser. You can now sign in with GitHub, add text to your knowledge base, and start chatting!

---

## 🔮 Future Enhancements (Roadmap)

This project has a robust, production-ready foundation. Here are several features that can be implemented to expand its capabilities:

- **File Uploads (PDF, DOCX, CSV):** Integrate file parsing libraries (like `pdf-parse`) to allow users to drag-and-drop complex documents rather than just pasting raw text.
- **Advanced Text Chunking:** Implement dynamic text splitters (e.g., using LangChain's `RecursiveCharacterTextSplitter`) to break large documents into smaller, overlapping chunks before embedding, improving retrieval accuracy.
- **Persistent Chat History:** Create a `Message` and `Chat` model in Prisma to save user conversations, allowing users to revisit past threads.
- **Document Management UI:** Build a dashboard page where users can view, edit, or delete the specific documents they have vectorized.
- **Hybrid Search:** Combine `pgvector` similarity search with Full-Text Search (keyword search) to create a hybrid retrieval pipeline for even higher accuracy.
- **Multiple AI Providers:** Abstract the embedding and generation models to allow users to toggle between OpenAI, Anthropic, or local models via Ollama.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://www.google.com/search?q=https://github.com/your-username/rag-chatbot/issues).

## 📝 License

This project is licensed under the MIT License.

```

```
