// src/components/IngestForm.tsx
"use client"

import { useFormStatus } from "react-dom"
import { ingestDocument } from "@/action/action"
import { useRef } from "react"

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-md hover:bg-slate-800 disabled:opacity-50 transition-colors"
    >
      {pending ? "Generating Embedding..." : "Save to Knowledge Base"}
    </button>
  )
}

export default function IngestForm() {
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <div className="w-full max-w-2xl p-6 bg-white border border-slate-200 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Add to your Knowledge Base</h2>
      <form
        ref={formRef}
        action={async (formData) => {
          await ingestDocument(formData)
          formRef.current?.reset() // Clear the form after submission
        }}
        className="flex flex-col"
      >
        <textarea
          name="content"
          rows={4}
          placeholder="Paste some text here (e.g., company policies, product details)..."
          className="w-full p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
          required
        />
        <div className="self-end">
          <SubmitButton />
        </div>
      </form>
    </div>
  )
}