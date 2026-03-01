import Link from "next/link"
import { Swords, Mail } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm flex flex-col items-center gap-6 text-center">
        <Link href="/" className="flex items-center gap-2">
          <Swords className="h-8 w-8 text-primary" />
          <span className="font-serif text-2xl font-bold text-foreground">CB Games</span>
        </Link>

        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
          <Mail className="h-8 w-8 text-primary" />
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="font-serif text-xl font-bold text-foreground">Verifique seu e-mail</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Enviamos um link de confirmacao para o seu e-mail. Clique no link para ativar sua conta e comecar a criar personagens.
          </p>
        </div>

        <Link
          href="/auth/login"
          className="inline-flex items-center justify-center rounded-lg border border-border bg-secondary px-6 py-2.5 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-accent"
        >
          Voltar para o Login
        </Link>
      </div>
    </main>
  )
}
