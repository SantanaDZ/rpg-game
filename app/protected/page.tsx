import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { CharacterList } from "@/components/character-list"
import { LogoutButton } from "@/components/logout-button"
import { TeamNameEditor } from "@/components/team-name-editor"
import { Swords, Plus, Trophy, Rocket } from "lucide-react"
import Link from "next/link"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: characters } = await supabase
    .from("characters")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, team_name")
    .eq("id", user.id)
    .single()

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <Swords className="h-7 w-7 text-primary" />
              <h1 className="font-serif text-2xl font-bold text-foreground">Meus Personagens</h1>
            </div>
            <div className="mt-1 ml-10">
              <TeamNameEditor initialTeamName={profile?.team_name} userId={user.id} />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/protected/minigame"
              className="inline-flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-500 transition-colors hover:bg-amber-500/20"
            >
              <Rocket className="h-4 w-4" />
              <span className="hidden sm:inline">Defesa da Masmorra</span>
            </Link>
            <Link
              href="/protected/battle"
              className="inline-flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/20"
            >
              <Trophy className="h-4 w-4" />
              <span className="hidden sm:inline">Arena de Batalha</span>
            </Link>
            <Link
              href="/personagem/novo"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Novo Personagem</span>
            </Link>
            <LogoutButton />
          </div>
        </header>

        <div className="mb-6 rounded-xl border border-border bg-card p-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Logado como <span className="font-medium text-foreground">{profile?.username || user.email}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            <span className="font-bold text-primary">{characters?.length ?? 0}</span> personagem(ns)
          </p>
        </div>

        <CharacterList characters={characters ?? []} />
      </div>
    </main>
  )
}
