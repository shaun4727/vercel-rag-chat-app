// src/components/AuthButton.tsx
import { auth, signIn, signOut } from "@/auth"

export default async function AuthButton() {
  const session = await auth()

  if (session?.user) {
    return (
      <div className="flex items-center gap-4">
        <p className="text-sm">Signed in as {session.user.name}</p>
        <form
          action={async () => {
            "use server"
            await signOut()
          }}
        >
          <button 
            type="submit" 
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Sign Out
          </button>
        </form>
      </div>
    )
  }

  return (
    <form
      action={async () => {
        "use server"
        await signIn("github")
      }}
    >
      <button 
        type="submit" 
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Sign in with GitHub
      </button>
    </form>
  )
}