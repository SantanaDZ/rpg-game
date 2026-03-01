import Link from "next/link"
import { Swords, AlertTriangle } from "lucide-react"

export default function AuthErrorPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm flex flex-col items-center gap-6 text-center">
        <Link href="/" className="flex items-center gap-2">
          <Swords className="h-8 w-8 text-primary" />
          <span className="font-serif text-2xl font-bold text-foreground">CB Games</span>
        </Link>

        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 border border-destructive/20">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="font-serif text-xl font-bold text-foreground">Erro de Autenticacao</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Ocorreu um erro durante a autenticacao. Por favor, tente novamente.
          </p>
        </div>

        <Link
          href="/auth/login"
          className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Voltar para o Login
        </Link>
      </div>
    </main>
  )
}
