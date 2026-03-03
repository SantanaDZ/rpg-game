"use client"

import { motion } from "framer-motion"
import { Shield, Swords, Brain, Zap, Heart } from "lucide-react"
import type { MatchupResult } from "@/types/game"

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
    strength: <Swords className="h-3 w-3" />,
    intelligence: <Brain className="h-3 w-3" />,
    agility: <Zap className="h-3 w-3" />,
    endurance: <Shield className="h-3 w-3" />,
    charisma: <Heart className="h-3 w-3" />,
}

export function MatchupRow({ result }: { result: MatchupResult }) {
    const won = result.winner === 'player'
    const shakeX = result.critical ? [-10, 10, -8, 8, -5, 5, -2, 2, 0] : [-3, 3, -2, 2, 0]
    const shakeDuration = result.critical ? 0.5 : 0.25
    return (
        <div className="relative overflow-hidden rounded-lg">
            {result.critical && (
                <motion.div
                    initial={{ opacity: 0.45 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className="absolute inset-0 bg-white/30 pointer-events-none z-10 rounded-lg"
                />
            )}
            <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0, x: shakeX }}
                transition={{ duration: shakeDuration }}
                className={`flex items-center gap-3 px-4 py-2 border ${won
                    ? 'border-blue-500/40 bg-blue-500/10'
                    : 'border-red-500/40 bg-red-500/10'
                    }`}
            >
                <span className={`text-lg font-black flex-shrink-0 ${won ? 'text-blue-400' : 'text-red-400'}`}>
                    {won ? '✓' : '✗'}
                </span>
                <span className="text-sm font-bold text-slate-200 truncate">{result.playerCharName}</span>
                <span className="text-xs text-slate-500 flex items-center gap-1 flex-shrink-0">
                    {CATEGORY_ICONS[result.attackAttribute?.id || 'strength']}
                    {result.attackAttribute?.label || 'Força'}
                </span>
                <span className={`text-xs font-bold tabular-nums flex-shrink-0 ${won ? 'text-blue-300' : 'text-red-300'}`}>
                    {result.playerStat} {won ? '>' : '<'} {result.mobStat}
                </span>
                <span className="text-xs text-slate-500 truncate">vs {result.mobName}</span>
                <div className="ml-auto flex items-center gap-1 flex-shrink-0">
                    {result.boosted && (
                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-tighter">
                            BOOST!
                        </span>
                    )}
                    {result.critical && (
                        <span className="text-[10px] font-black text-yellow-400 uppercase tracking-tighter">
                            CRÍTICO!
                        </span>
                    )}
                </div>
            </motion.div>
        </div>
    )
}
