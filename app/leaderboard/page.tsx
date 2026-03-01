import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Trophy, ArrowLeft, Crown, Swords, Star } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: 'Leaderboard — Dungeon RPG',
    description: 'Ranking dos melhores times do Dungeon RPG',
}

interface LeaderboardRow {
    id: string
    username: string | null
    team_name: string | null
    total_wins: number
    best_xp: number
    character_count: number
}

export default async function LeaderboardPage() {
    const supabase = await createClient()

    const { data: rows, error } = await supabase
        .from('leaderboard')
        .select('*')

    const entries = (rows as LeaderboardRow[] | null) ?? []

    const MEDAL: Record<number, string> = { 0: '🥇', 1: '🥈', 2: '🥉' }

    return (
        <main className="min-h-screen bg-slate-950 text-slate-100 px-4 py-10">
            <div className="mx-auto max-w-2xl flex flex-col gap-8">

                {/* Header */}
                <header className="flex items-center justify-between">
                    <Link href="/protected" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm">
                        <ArrowLeft className="h-4 w-4" />
                        Dashboard
                    </Link>
                    <h1 className="font-serif text-3xl font-black tracking-tighter text-amber-400 flex items-center gap-2">
                        <Trophy className="h-7 w-7" />
                        Leaderboard
                    </h1>
                    <div className="w-24" />
                </header>

                {error && (
                    <div className="rounded-lg bg-red-950/40 border border-red-800 px-4 py-3 text-sm text-red-300">
                        Erro ao carregar ranking. A view de leaderboard pode ainda não ter sido criada no Supabase.
                    </div>
                )}

                {/* Table */}
                {entries.length === 0 && !error ? (
                    <div className="text-center text-slate-500 py-20">
                        <Crown className="h-12 w-12 mx-auto mb-3 opacity-30" />
                        <p>Nenhum dado ainda. Jogue uma batalha para aparecer aqui!</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        {/* Column headers */}
                        <div className="grid grid-cols-[2rem_1fr_auto_auto_auto] gap-4 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-600">
                            <span>#</span>
                            <span>Time</span>
                            <span className="text-right flex items-center gap-1 justify-end"><Swords className="h-3 w-3" /> Vitórias</span>
                            <span className="text-right flex items-center gap-1 justify-end"><Star className="h-3 w-3" /> Melhor XP</span>
                            <span className="text-right">Heróis</span>
                        </div>

                        {entries.map((entry, i) => (
                            <div
                                key={entry.id}
                                className={`grid grid-cols-[2rem_1fr_auto_auto_auto] gap-4 items-center px-4 py-3 rounded-xl border transition-colors ${i === 0
                                    ? 'border-amber-700/60 bg-amber-950/20'
                                    : i === 1
                                        ? 'border-slate-500/40 bg-slate-800/30'
                                        : i === 2
                                            ? 'border-orange-800/40 bg-orange-950/10'
                                            : 'border-slate-800 bg-slate-900/40'
                                    }`}
                            >
                                <span className="text-lg">
                                    {MEDAL[i] ?? <span className="text-sm font-bold text-slate-500">{i + 1}</span>}
                                </span>
                                <div className="min-w-0">
                                    <p className={`font-bold truncate ${i === 0 ? 'text-amber-300' : 'text-slate-200'}`}>
                                        {entry.team_name || 'Time sem nome'}
                                    </p>
                                    <p className="text-[10px] text-slate-500 truncate">{entry.username ?? '—'}</p>
                                </div>
                                <span className={`text-sm font-black tabular-nums text-right ${i === 0 ? 'text-amber-400' : 'text-slate-300'}`}>
                                    {entry.total_wins}
                                </span>
                                <span className="text-sm tabular-nums text-right text-slate-400">
                                    {entry.best_xp.toLocaleString()}
                                </span>
                                <span className="text-sm tabular-nums text-right text-slate-500">
                                    {entry.character_count}
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                <p className="text-center text-[10px] text-slate-700">Top 50 • Atualizado em tempo real</p>
            </div>
        </main>
    )
}
