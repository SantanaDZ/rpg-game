"use client"

import { useState, useEffect, useMemo } from "react"
import { createClient } from "@/lib/supabase/client"
import { PixelCharacterAvatar } from "@/components/pixel-character-avatar"
import {
    RefreshCcw, ArrowLeft, Play,
    ChevronRight, Skull, Star, Trophy, Zap,
} from "lucide-react"
import Link from "next/link"
import { calculateEffectiveStats, CATEGORIES } from "@/lib/game-constants"
import { useDungeon, type BattleSpeed } from "@/hooks/use-battle"
import { useSoundStings } from "@/hooks/use-sound-stings"
import { motion, AnimatePresence, Reorder } from "framer-motion"
import { MatchupRow } from "@/components/battle/MatchupRow"
import { MobCard } from "@/components/battle/MobCard"
import { DraggableCharCard } from "@/components/battle/DraggableCharCard"
import { ActionPromptOverlay } from "@/components/battle/ActionPromptOverlay"
import { KeyboardHint, BoostScoreFloat } from "@/components/battle/BattleUtils"
import type { Character } from "@/types/game"

// ── Speed toggle config ───────────────────────────────────────────────────────

const SPEED_OPTIONS: { value: BattleSpeed; label: string; icon: string }[] = [
    { value: 'slow', label: 'Lento', icon: '🐢' },
    { value: 'normal', label: 'Normal', icon: '⚡' },
    { value: 'fast', label: 'Rápido', icon: '🚀' },
]

// ── Main page ─────────────────────────────────────────────────────────────────

export default function BattlePage() {
    const [characters, setCharacters] = useState<Character[]>([])
    const [loading, setLoading] = useState(true)
    const [speed, setSpeed] = useState<BattleSpeed>('normal')
    const supabase = createClient()
    const { play } = useSoundStings()

    useEffect(() => {
        async function fetchCharacters() {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return
            const { data } = await supabase.from('characters').select('*').eq('user_id', user.id)
            setCharacters(data || [])
            setLoading(false)
        }
        fetchCharacters()
    }, [])

    const {
        wave, bestWave, phase, mobs,
        characterOrder, attackAttributes, matchupResults, currentMatchup,
        activePrompt, promptResult, perfectRun,
        startFight, nextWave, restartDungeon,
        reorderCharacters, setAttackAttribute, handleMobileAction,
    } = useDungeon(characters, speed)

    // Bug #4 fix: XP for all, wins only for matchup winners
    // Também grava histórico da run ao terminar (WAVE_CLEAR = vitória de onda, GAME_OVER = fim de run)
    useEffect(() => {
        if (phase === 'WAVE_CLEAR') {
            play('victory')
            const xpGain = wave * 15
            void Promise.all([
                // XP para todos
                ...characters.map(char =>
                    supabase.rpc('increment_xp', { char_id: char.id, xp_amount: xpGain })
                ),
                // Wins apenas para vencedores do matchup
                ...matchupResults
                    .filter(r => r.winner === 'player')
                    .map(r => supabase.rpc('increment_wins', { char_id: r.playerCharId })),
            ])
        }
        if (phase === 'GAME_OVER') {
            play('defeat')
            // Salva o histórico da run completa no banco
            void supabase.from('battle_history').insert({
                wave_reached: wave,
                perfect_run: perfectRun,
                xp_earned: wave * 15 * characters.length,
            })
        }
    }, [phase])

    useEffect(() => {
        const last = matchupResults.at(-1)
        if (last?.critical) play('critical')
        else if (last) play('hit')
    }, [matchupResults.length])

    // Melhoria #9: memoized boostDelta
    const boostDelta = useMemo(() => {
        const last = matchupResults.at(-1)
        if (!last?.boosted) return 0
        return Math.abs(last.playerStat - last.mobStat) || 1
    }, [matchupResults])

    const orderedChars = characterOrder
        .map(id => characters.find(c => c.id === id))
        .filter(Boolean) as Character[]

    const isEliteWave = wave % 5 === 0 && wave > 1

    const scenarioIndex = Math.floor((wave - 1) / 5) % 8
    const col = scenarioIndex % 2
    const row = Math.floor(scenarioIndex / 2)
    const bgPosX = col === 0 ? "0%" : "100%"
    const bgPosY = row === 0 ? "0%" : row === 1 ? "33.333%" : row === 2 ? "66.666%" : "100%"

    if (loading) {
        return <div className="flex min-h-screen items-center justify-center text-slate-400">Carregando Dungeon...</div>
    }

    if (characters.length < 3) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-950 text-slate-100 px-4">
                <Skull className="h-12 w-12 text-slate-600" />
                <p className="text-slate-400">Você precisa de pelo menos 3 personagens para entrar no dungeon.</p>
                <Link href="/personagem/novo" className="rounded-lg bg-amber-600 px-6 py-2 font-bold hover:bg-amber-500 transition-colors">
                    Criar Personagem
                </Link>
            </main>
        )
    }

    return (
        <main
            className="min-h-screen relative px-4 py-8 text-slate-100 transition-colors duration-1000"
            style={{
                backgroundImage: isEliteWave ? "url('/bg-elite-dungeon.png')" : "url('/fases.png')",
                backgroundSize: isEliteWave ? "cover" : "200% 400%",
                backgroundPosition: isEliteWave ? "center" : `${bgPosX} ${bgPosY}`,
                imageRendering: "pixelated"
            }}
        >
            <div className="absolute inset-0 bg-slate-950/85 pointer-events-none" />

            <div className="relative z-10 mx-auto max-w-3xl">

                {/* Header */}
                <header className="mb-6 flex items-center justify-between">
                    <Link href="/protected" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                        <ArrowLeft className="h-5 w-5" />
                        <span className="text-sm">Voltar</span>
                    </Link>
                    <h1 className="font-serif text-2xl font-bold tracking-tighter text-amber-500 flex items-center gap-2">
                        <Skull className="h-6 w-6" />
                        DUNGEON
                    </h1>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Trophy className="h-3 w-3 text-amber-400" />
                        <span>Recorde: <span className="font-bold text-amber-400">Onda {bestWave}</span></span>
                    </div>
                </header>

                {/* Wave badge */}
                <div className="mb-6 text-center">
                    <span className={`inline-block rounded-full border px-4 py-1 text-sm font-bold tracking-widest uppercase ${isEliteWave
                        ? 'border-red-700 bg-red-950/40 text-red-300'
                        : 'border-slate-700 bg-slate-800 text-slate-300'
                        }`}>
                        {isEliteWave && '★ '}Onda {wave}{isEliteWave && ' ★'}
                    </span>
                </div>

                {/* ── PREP ─────────────────────────────────────────────────── */}
                {phase === 'PREP' && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4">
                        <div className="grid grid-cols-2 gap-3">
                            {/* LEFT: draggable character column */}
                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-bold text-blue-400 uppercase text-center mb-1">
                                    ⠿ Sua Equipe <span className="font-normal text-slate-600 normal-case">(arraste)</span>
                                </span>
                                <Reorder.Group
                                    axis="y"
                                    values={characterOrder}
                                    onReorder={reorderCharacters}
                                    className="flex flex-col gap-2"
                                >
                                    {orderedChars.map((char) => (
                                        <DraggableCharCard
                                            key={char.id}
                                            charId={char.id}
                                            char={char}
                                            attackAttr={attackAttributes[char.id] || CATEGORIES[0]}
                                            onAttrChange={attr => setAttackAttribute(char.id, attr)}
                                        />
                                    ))}
                                </Reorder.Group>
                            </div>

                            {/* RIGHT: mob column */}
                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-bold text-red-400 uppercase text-center mb-1">
                                    Inimigos
                                </span>
                                <div className="flex flex-col gap-2">
                                    {mobs.map((mob, i) => {
                                        const char = orderedChars[i]
                                        const playerEff = char ? calculateEffectiveStats(char) : undefined
                                        return (
                                            <MobCard
                                                key={mob.id}
                                                mob={mob}
                                                playerEff={playerEff}
                                                isEliteWave={isEliteWave}
                                            />
                                        )
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Risk legend */}
                        <div className="flex justify-center gap-4 text-[10px] text-slate-600">
                            <span><span className="text-red-400">■</span> Perigoso</span>
                            <span><span className="text-orange-400">■</span> Cuidado</span>
                            <span><span className="text-slate-400">■</span> Neutro</span>
                            <span><span className="text-emerald-400">■</span> Favorável</span>
                            <span><span className="text-green-400">■</span> Vantagem</span>
                        </div>

                        <KeyboardHint />

                        {/* Speed toggle */}
                        <div className="flex items-center justify-center gap-2">
                            {SPEED_OPTIONS.map(opt => (
                                <button
                                    key={opt.value}
                                    onClick={() => setSpeed(opt.value)}
                                    className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-bold transition-all border ${speed === opt.value
                                        ? 'bg-amber-600 border-amber-500 text-white'
                                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                                        }`}
                                >
                                    <span>{opt.icon}</span>
                                    {opt.label}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={startFight}
                            className="mt-2 mx-auto flex items-center gap-2 rounded-full bg-amber-600 px-10 py-3 text-base font-bold text-white hover:bg-amber-500 active:scale-95 transition-all shadow-lg shadow-amber-900/30"
                        >
                            <Play className="h-5 w-5 fill-current" />
                            INICIAR BATALHA
                        </button>
                    </motion.div>
                )}

                {/* ── FIGHTING ─────────────────────────────────────────────── */}
                {phase === 'FIGHTING' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
                        <p className="text-center text-xs font-bold text-amber-400 uppercase tracking-widest animate-pulse mb-2">
                            Combatendo...
                        </p>

                        {/* Character avatars */}
                        <div className="flex justify-center gap-6 mb-2">
                            {orderedChars.map((char, i) => {
                                const isActive = currentMatchup === i
                                const result = matchupResults[i]
                                return (
                                    <div key={char.id} className="flex flex-col items-center gap-1">
                                        <motion.div
                                            animate={isActive ? { y: [-6, 0], scale: [1.15, 1] } : {}}
                                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                            className={`rounded-lg p-1 border ${isActive
                                                ? 'border-amber-500 bg-amber-500/10'
                                                : result
                                                    ? result.winner === 'player'
                                                        ? 'border-blue-500/30 bg-blue-500/5'
                                                        : 'border-red-500/30 bg-red-500/5'
                                                    : 'border-slate-800 opacity-40'
                                                }`}
                                        >
                                            <PixelCharacterAvatar type={char.character_type} className="w-40 h-40" />
                                        </motion.div>
                                        <div className="flex flex-col items-center">
                                            <span className="text-[10px] text-slate-500 truncate max-w-[80px] text-center">{char.name}</span>
                                            {isActive && !result && <RefreshCcw className="h-3 w-3 text-amber-400 animate-spin mt-1" />}
                                            {result && (
                                                <span className={`text-sm font-black ${result.winner === 'player' ? 'text-blue-400' : 'text-red-400'}`}>
                                                    {result.winner === 'player' ? '✓' : '✗'}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {/* ── WASD action prompt + boost float ── */}
                        <div className="relative">
                            <ActionPromptOverlay
                                prompt={activePrompt}
                                result={promptResult}
                                onMobileAction={handleMobileAction}
                                phase={phase}
                            />
                            <BoostScoreFloat delta={promptResult === 'HIT' && !activePrompt ? boostDelta : null} />
                        </div>

                        {/* Sequential results */}
                        <div className="flex flex-col gap-2">
                            {matchupResults.map((result, i) => (
                                <MatchupRow key={i} result={result} />
                            ))}
                            {currentMatchup >= 0 && currentMatchup >= matchupResults.length && (
                                <div className="flex items-center gap-3 px-4 py-2 rounded-lg border border-slate-800 bg-slate-900 opacity-60">
                                    <RefreshCcw className="h-4 w-4 text-amber-400 animate-spin" />
                                    <span className="text-sm text-slate-400">
                                        {orderedChars[currentMatchup]?.name} vs {mobs[currentMatchup]?.name}...
                                    </span>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* ── WAVE_CLEAR ───────────────────────────────────────────── */}
                {phase === 'WAVE_CLEAR' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center gap-6 py-12"
                    >
                        <motion.div
                            animate={{ rotate: [0, -12, 12, -8, 8, 0] }}
                            transition={{ duration: 0.7, delay: 0.1 }}
                        >
                            <Star className="h-20 w-20 text-amber-400" />
                        </motion.div>
                        <div className="text-center">
                            <h2 className="text-5xl font-black italic tracking-tighter text-amber-500 mb-2">
                                ONDA {wave} COMPLETA!
                            </h2>
                            <p className="text-slate-400 text-lg">
                                +<span className="font-bold text-amber-300">{wave * 15} XP</span> por personagem
                            </p>
                            {perfectRun && (
                                <motion.p
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', delay: 0.3 }}
                                    className="text-emerald-400 text-base font-black mt-2 tracking-widest"
                                >
                                    ✦ PERFECT RUN! ✦
                                </motion.p>
                            )}
                        </div>
                        <div className="flex flex-col gap-2 w-full max-w-md">
                            {matchupResults.map((result, i) => <MatchupRow key={i} result={result} />)}
                        </div>
                        <button
                            onClick={nextWave}
                            className="flex items-center gap-2 rounded-full bg-amber-600 px-10 py-3 text-base font-bold hover:bg-amber-500 active:scale-95 transition-all shadow-lg shadow-amber-900/30"
                        >
                            Próxima Onda
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </motion.div>
                )}

                {/* ── GAME_OVER ────────────────────────────────────────────── */}
                {phase === 'GAME_OVER' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center gap-6 py-12"
                    >
                        <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                            <Skull className="h-20 w-20 text-slate-500" />
                        </motion.div>
                        <div className="text-center">
                            <h2 className="text-5xl font-black italic tracking-tighter text-slate-400 mb-2">
                                GAME OVER
                            </h2>
                            <p className="text-slate-500 text-lg">
                                Chegou até a <span className="font-bold text-slate-300">Onda {wave}</span>
                            </p>
                            {wave >= bestWave && (
                                <p className="text-amber-400 text-sm font-bold mt-1 animate-pulse">Novo recorde! 🏆</p>
                            )}
                        </div>
                        <div className="flex flex-col gap-2 w-full max-w-md">
                            {matchupResults.map((result, i) => <MatchupRow key={i} result={result} />)}
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={restartDungeon}
                                className="flex items-center gap-2 rounded-lg bg-slate-800 px-6 py-3 font-bold hover:bg-slate-700 transition-colors"
                            >
                                <RefreshCcw className="h-4 w-4" />
                                Reiniciar
                            </button>
                            <Link
                                href="/protected"
                                className="flex items-center gap-2 rounded-lg bg-amber-700 px-6 py-3 font-bold hover:bg-amber-600 transition-colors"
                            >
                                Sair
                            </Link>
                        </div>
                    </motion.div>
                )}

            </div>
        </main>
    )
}
