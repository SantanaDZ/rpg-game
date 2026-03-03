import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { CharacterForm } from "@/components/character-form"
import { Swords } from "lucide-react"
import Link from "next/link"

export default async function NewCharacterPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex items-center gap-3">
          <Link href="/protected" className="flex items-center gap-2">
            <Swords className="h-7 w-7 text-primary" />
            <span className="font-serif text-xl font-bold text-foreground">SDZ Games</span>
          </Link>
          <span className="text-muted-foreground">/</span>
          <h1 className="font-serif text-xl font-bold text-foreground">Novo Personagem</h1>
        </header>
        <CharacterForm mode="create" />
      </div>
    </main>
  )
}
