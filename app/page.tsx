import Link from "next/link"
import { Swords, Shield, Sparkles } from "lucide-react"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="flex flex-col items-center gap-8 text-center max-w-2xl">
        <div className="flex items-center gap-3">
          <Swords className="h-10 w-10 text-primary" />
          <h1 className="font-serif text-5xl font-bold tracking-tight text-foreground md:text-6xl text-balance">
            CB Games
          </h1>
          <Shield className="h-10 w-10 text-primary" />
        </div>

        <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
          Crie personagens unicos para suas aventuras de RPG. Personalize atributos,
          aparencia e muito mais.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Sparkles className="h-4 w-4" />
            Entrar
          </Link>
          <Link
            href="/auth/sign-up"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-secondary px-8 py-3 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-accent"
          >
            Criar Conta
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border w-full">
          <div className="flex flex-col items-center gap-2">
            <span className="text-2xl font-bold text-primary font-serif">5</span>
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Atributos</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-2xl font-bold text-primary font-serif">1-10</span>
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Escala</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-2xl font-bold text-primary font-serif">&infin;</span>
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Personagens</span>
          </div>
        </div>
      </div>
    </main>
  )
}
