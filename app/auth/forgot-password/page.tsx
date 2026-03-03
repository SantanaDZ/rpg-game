"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { Swords, Mail, ArrowLeft } from "lucide-react"

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)

    async function handleResetPassword(e: React.FormEvent) {
        e.preventDefault()
        setError(null)
        setLoading(true)

        const supabase = createClient()

        // As per Supabase docs, the redirect URL should be where the user lands after clicking the email link.
        // We direct them to our auth callback to handle the #access_token securely serverside.
        const resetUrl = `${window.location.origin}/auth/callback?next=/auth/update-password`

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: resetUrl,
        })

        if (error) {
            console.error("Supabase reset error:", error)
            setError(`Erro: ${error.message} (Isso geralmente acontece se o envio de e-mail estiver desligado no seu painel do Supabase, ou a taxa limite for atingida).`)
        } else {
            setSuccess(true)
        }

        setLoading(false)
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center px-4 bg-slate-950">
            <div className="w-full max-w-sm flex flex-col gap-8">
                <div className="flex flex-col items-center gap-3">
                    <Link href="/" className="flex items-center gap-2">
                        <Swords className="h-8 w-8 text-amber-500" />
                        <span className="font-serif text-2xl font-bold text-slate-100">SDZ Games</span>
                    </Link>
                    <p className="text-sm text-slate-400">Recuperação de Senha</p>
                </div>

                {success ? (
                    <div className="flex flex-col items-center gap-6 text-center rounded-2xl bg-slate-900/50 border border-slate-800 p-8">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                            <Mail className="h-8 w-8" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-100">E-mail Enviado!</h2>
                        <p className="text-sm text-slate-400">
                            Verifique a caixa de entrada do e-mail <strong className="text-slate-300">{email}</strong> com as instruções para redefinir sua senha.
                        </p>
                        <Link
                            href="/auth/login"
                            className="mt-4 inline-flex items-center justify-center rounded-lg bg-slate-800 px-6 py-3 text-sm font-semibold text-slate-300 transition-colors hover:bg-slate-700 w-full"
                        >
                            Voltar ao Login
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
                        {error && (
                            <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-500">
                                {error}
                            </div>
                        )}

                        <div className="flex flex-col gap-2">
                            <label htmlFor="email" className="text-sm font-medium text-slate-300">
                                E-mail da Conta
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="seu@email.com"
                                required
                                className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-amber-600 px-4 py-3 text-sm font-bold text-white transition-all hover:bg-amber-500 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50"
                        >
                            <Mail className="h-4 w-4" />
                            {loading ? "Enviando..." : "Enviar Link de Recuperação"}
                        </button>
                        <Link
                            href="/auth/login"
                            className="mt-2 text-center text-sm font-medium text-slate-400 hover:text-slate-300 flex items-center justify-center gap-1"
                        >
                            <ArrowLeft className="w-4 h-4" /> Voltar
                        </Link>
                    </form>
                )}
            </div>
        </main>
    )
}
