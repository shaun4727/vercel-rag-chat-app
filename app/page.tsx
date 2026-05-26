// src/app/page.tsx
import AuthButton from "@/components/custom/auth-button"
import IngestForm from "@/components/custom/ingest-form"
import Chat from "@/components/custom/chat"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"

export default async function Home() {
  const session = await auth()
  
  const docCount = session?.user?.id 
    ? await prisma.document.count({ where: { userId: session.user.id } }) 
    : 0

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-slate-100 gap-8">
      {/* Navbar */}
      <div className="w-full max-w-5xl flex justify-between items-center bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-800">Next.js RAG Platform</h1>
        <AuthButton />
      </div>

      {session?.user ? (
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Data Ingestion */}
          <div className="md:col-span-5 space-y-4">
            <IngestForm />
            <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-sm">
              <p className="text-slate-600 text-sm">
                Database Status: <strong className="text-blue-600">{docCount}</strong> documents vectorized.
              </p>
            </div>
          </div>

          {/* Right Column: AI Chat */}
          <div className="md:col-span-7 flex justify-center">
            <Chat />
          </div>

        </div>
      ) : (
        <div className="p-12 text-center bg-white border border-slate-200 rounded-lg shadow-sm max-w-2xl mt-12">
          <h2 className="text-2xl font-semibold text-slate-800">Welcome to your Private AI</h2>
          <p className="text-slate-500 mt-4 text-lg">
            Sign in to upload your private documents, generate vector embeddings, and chat securely with your own data.
          </p>
        </div>
      )}
    </main>
  )
}