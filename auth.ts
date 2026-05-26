// src/auth.ts
import NextAuth, { type DefaultSession } from "next-auth"
import GitHub from "next-auth/providers/github"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "./lib/prisma"

// --- TypeScript Module Augmentation ---
// This tells TypeScript that our session user object includes an 'id'
declare module "next-auth" {
  interface Session {
    user: {
      id: string
    } & DefaultSession["user"]
  }
}
// --------------------------------------

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID as string,
      clientSecret: process.env.AUTH_GITHUB_SECRET as string,
    }),
  ],
  session: {
    strategy: "database", 
  },
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        // TypeScript will no longer complain about this line!
        session.user.id = user.id 
      }
      return session
    },
  },
})