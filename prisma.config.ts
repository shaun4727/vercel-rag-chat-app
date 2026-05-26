import { defineConfig } from "prisma/config"
import * as dotenv from "dotenv"
import path from "path"

// 1. Force dotenv to use the absolute path to your root .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // 2. Safely fallback to your exact URL if process.env fails to populate
    url: process.env.DATABASE_URL || "postgresql://postgres:12345678@localhost:5432/rag_vercel_ai_db?schema=public",
  },
})