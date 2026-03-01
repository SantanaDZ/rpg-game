import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { CharacterForm } from "@/components/character-form"
import { Swords } from "lucide-react"
import Link from "next/link"

export default async function EditCharacterPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: character, error } = await supabase
    .from("characters")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (error || !character) {
    notFound()
  }

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex items-center gap-3">
          <Link href="/protected" className="flex items-center gap-2">
            <Swords className="h-7 w-7 text-primary" />
            <span className="font-serif text-xl font-bold text-foreground">CB Games</span>
          </Link>
          <span className="text-muted-foreground">/</span>
          <h1 className="font-serif text-xl font-bold text-foreground">Editar Personagem</h1>
        </header>
        <CharacterForm mode="edit" initialData={character} />
      </div>
    </main>
  )
}
