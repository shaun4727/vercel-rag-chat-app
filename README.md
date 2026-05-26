That is a great idea. Compiling a clean, working blueprint based on the hurdles we navigated ensures you have a rock-solid foundation without the trial-and-error.

Here is the consolidated, error-free guide for Steps 1 and 2, fully updated for Prisma 7 and the system-level `pgvector` requirements.

---

### Step 1: Project Setup & Dependencies

**1. Create the Next.js App**
Scaffold your Next.js application using `pnpm` (Next.js 16, App Router, TypeScript, Tailwind CSS v4).

```bash
pnpm create next-app@latest rag-chatbot
cd rag-chatbot

```

**2. Initialize shadcn/ui**
Set up your accessible UI components.

```bash
pnpm dlx shadcn@latest init

```

**3. Install Core Backend, AI, & Config Dependencies**
Install NextAuth, Vercel AI SDK, Prisma, and `dotenv` (which is crucial for Prisma 7's configuration file).

```bash
pnpm add next-auth ai @ai-sdk/openai prisma @prisma/client
pnpm add -D dotenv

```

**4. Initialize Prisma**
Scaffold your Prisma environment.

```bash
pnpm dlx prisma init

```

---

### Step 2: Database & `pgvector` Setup

#### 1. System-Level Pre-requisite: Install `pgvector`

Before Prisma can enable the extension, the software must be installed on your operating system. Assuming you are using PostgreSQL 16 on Ubuntu/Debian:

```bash
sudo apt-get update
sudo apt-get install postgresql-16-pgvector
sudo systemctl restart postgresql

```

#### 2. Configure Environment Variables

Ensure you have a `.env` file at the **exact root** of your project (next to `package.json`).

```env
# .env

# Your PostgreSQL database URL
DATABASE_URL="postgresql://postgres:12345678@localhost:5432/rag_vercel_ai_db?schema=public"

# OpenAI API Key 
OPENAI_API_KEY="sk-your-openai-api-key"

# NextAuth Secret (Generate via: openssl rand -base64 32)
NEXTAUTH_SECRET="your-generated-secret-here"
NEXTAUTH_URL="http://localhost:3000"

```

#### 3. Update the Prisma Schema (Prisma 7 Format)

Open `prisma/schema.prisma`. Note that in Prisma 7, the `url` property is removed from the `datasource` block.

```prisma
// prisma/schema.prisma

generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["postgresqlExtensions"]
}

datasource db {
  provider   = "postgresql"
  extensions = [vector] // Enables pgvector extension automatically
}

// --- RAG Models ---

model Document {
  id        String   @id @default(cuid())
  content   String   @db.Text
  
  // 1536 is the dimension size for OpenAI text-embedding-3-small
  embedding Unsupported("vector(1536)")? 
  
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
}

// --- NextAuth Models ---

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  accounts      Account[]
  sessions      Session[]
  documents     Document[] 
}

model Account {
  id                 String  @id @default(cuid())
  userId             String
  type               String
  provider           String
  providerAccountId  String
  refresh_token      String?  @db.Text
  access_token       String?  @db.Text
  expires_at         Int?
  token_type         String?
  scope              String?
  id_token           String?  @db.Text
  session_state      String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime
  @@unique([identifier, token])
}

```

#### 4. Create the Prisma Configuration File

Create `prisma.config.ts` at the root of your project. This explicitly loads your `.env` file using absolute paths to prevent resolution errors.

```typescript
// prisma.config.ts
import { defineConfig } from "prisma/config"
import * as dotenv from "dotenv"
import path from "path"

// Force dotenv to use the absolute path to your root .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Safely fallback to your exact URL if process.env fails
    url: process.env.DATABASE_URL || "postgresql://postgres:12345678@localhost:5432/rag_vercel_ai_db?schema=public",
  },
})

```

#### 5. Create the Prisma Client Singleton

Create `src/lib/prisma.ts` to prevent Fast Refresh from exhausting your database connection pool during development.

```typescript
// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma

```

#### 6. Run the Database Migration

Finally, push the schema to your database. (If you are recovering from the previous failed state, run `pnpm exec prisma migrate reset` instead).

```bash
pnpm exec prisma migrate dev --name init_db

```

---

Are you ready to move on to Step 3 and configure NextAuth to get user authentication working?