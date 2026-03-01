"use client"

import { Shield, Swords, Brain, Zap, Heart } from "lucide-react"
import { PixelCharacterAvatar } from "@/components/pixel-character-avatar"
import { calculateEffectiveStats, CATEGORIES } from "@/lib/game-constants"
import type { Mob } from "@/types/game"

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
    strength: <Swords className="h-3 w-3" />,
    intelligence: <Brain className="h-3 w-3" />,
    agility: <Zap className="h-3 w-3" />,
    endurance: <Shield className="h-3 w-3" />,
    charisma: <Heart className="h-3 w-3" />,
}

function StatWithRisk({ mobVal, playerVal, icon }: { mobVal: number; playerVal?: number; icon: React.ReactNode }) {
    const diff = playerVal !== undefined ? mobVal - playerVal : 0
    const iconColor = playerVal === undefined ? 'text-slate-500'
        : diff >= 5 ? 'text-red-500'
            : diff >= 2 ? 'text-orange-400'
                : diff <= -5 ? 'text-green-500'
                    : diff <= -2 ? 'text-emerald-500'
                        : 'text-slate-500'
    const numColor = playerVal === undefined ? 'text-slate-300'
        : diff >= 5 ? 'text-red-400 font-black'
            : diff >= 2 ? 'text-orange-300 font-bold'
                : diff <= -5 ? 'text-green-400'
                    : diff <= -2 ? 'text-emerald-400'
                        : 'text-slate-300'
    const title = playerVal !== undefined
        ? `Mob: ${mobVal} | Você: ${playerVal} (${diff >= 0 ? '+' : ''}${diff})`
        : `${mobVal}`
    return (
        <div title={title} className="flex flex-col items-center">
            <span className={iconColor}>{icon}</span>
            <span className={`text-[10px] ${numColor}`}>{mobVal}</span>
        </div>
    )
}

function MobStatRow({ mob, playerEff }: { mob: Mob; playerEff?: Record<string, number> }) {
    const eff = calculateEffectiveStats(mob)
    return (
        <div className="flex gap-2 mt-1">
            {CATEGORIES.map(cat => (
                <StatWithRisk
                    key={cat.id}
                    mobVal={eff[cat.id as keyof typeof eff] as number}
                    playerVal={playerEff?.[cat.id as keyof typeof playerEff] as number | undefined}
                    icon={CATEGORY_ICONS[cat.id]}
                />
            ))}
        </div>
    )
}

interface MobCardProps {
    mob: Mob
    playerEff?: Record<string, number>
    isEliteWave?: boolean
}

export function MobCard({ mob, playerEff, isEliteWave }: MobCardProps) {
    return (
        <div className={`rounded-xl border p-3 ${isEliteWave
            ? 'border-red-800 bg-red-950/30 shadow-[0_0_8px_rgba(220,38,38,0.2)]'
            : 'border-slate-800 bg-slate-900/60'
            }`}>
            {isEliteWave && (
                <span className="text-[9px] font-black text-red-400 uppercase tracking-widest block mb-1">
                    ★ ELITE
                </span>
            )}
            <div className="flex items-start gap-2">
                <PixelCharacterAvatar type={mob.character_type} className="w-20 h-20 flex-shrink-0" />
                <div className="min-w-0">
                    <p className={`text-sm font-bold truncate ${isEliteWave ? 'text-red-300' : 'text-red-400'}`}>
                        {mob.name}
                    </p>
                    <MobStatRow mob={mob} playerEff={playerEff} />
                </div>
            </div>
        </div>
    )
}
