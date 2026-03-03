"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Swords, Lock, Eye, EyeOff } from "lucide-react"
import Link from "next/link"

export default function UpdatePasswordPage() {
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [sessionLoading, setSessionLoading] = useState(true)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        // When the user clicks the email link, Supabase creates a session behind the scenes
        // We wait briefly to ensure the session is ready before allowing password change.
        async function checkSession() {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                setError("O link de recuperação expirou ou é inválido. Por favor, solicite a recuperação novamente.")
            }
            setSessionLoading(false)
        }
        checkSession()
    }, [])

    async function handleUpdatePassword(e: React.FormEvent) {
        e.preventDefault()
        setError(null)

        if (password !== confirmPassword) {
            setError("As senhas não coincidem.")
            return
        }

        if (password.length < 6) {
            setError("A senha deve ter pelo menos 6 caracteres.")
            return
        }

        setLoading(true)

        const { error } = await supabase.auth.updateUser({
            password: password,
        })

        if (error) {
            setError("Erro ao atualizar a senha. Tente novamente.")
            setLoading(false)
        } else {
            // Sign out to force re-login with new password, or route directly to /protected
            router.push("/protected")
            router.refresh()
        }
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center px-4 bg-slate-950">
            <div className="w-full max-w-sm flex flex-col gap-8">
                <div className="flex flex-col items-center gap-3">
                    <Link href="/" className="flex items-center gap-2">
                        <Swords className="h-8 w-8 text-amber-500" />
                        <span className="font-serif text-2xl font-bold text-slate-100">SDZ Games</span>
                    </Link>
                    <p className="text-sm text-slate-400">Criar Nova Senha</p>
                </div>

                {sessionLoading ? (
                    <div className="text-center text-slate-500 animate-pulse">Verificando link de recuperação...</div>
                ) : error && !error.includes("coincidem") && !error.includes("6 caracteres") ? (
                    <div className="flex flex-col items-center gap-4 text-center rounded-2xl bg-slate-900/50 border border-slate-800 p-8">
                        <div className="text-red-500 bg-red-500/10 p-4 rounded-full">
                            <Lock className="h-8 w-8" />
                        </div>
                        <p className="text-sm text-slate-400">{error}</p>
                        <Link
                            href="/auth/forgot-password"
                            className="mt-4 inline-flex items-center justify-center rounded-lg bg-amber-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-amber-500 w-full"
                        >
                            Solicitar Novo Link
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleUpdatePassword} className="flex flex-col gap-4">
                        {error && (
                            <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-500">
                                {error}
                            </div>
                        )}

                        <div className="flex flex-col gap-2">
                            <label htmlFor="password" className="text-sm font-medium text-slate-300">
                                Nova Senha
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Minimo de 6 caracteres"
                                    required
                                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-300">
                                Confirmar Nova Senha
                            </label>
                            <input
                                id="confirmPassword"
                                type={showPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Repita a nova senha"
                                required
                                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-amber-600 px-4 py-3 text-sm font-bold text-white transition-all hover:bg-amber-500 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50"
                        >
                            <Lock className="h-4 w-4" />
                            {loading ? "Atualizando..." : "Salvar Nova Senha"}
                        </button>
                    </form>
                )}
            </div>
        </main>
    )
}
