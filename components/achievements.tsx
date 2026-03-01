"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { getLevel } from "@/lib/game-constants"

interface CharacterSummary {
    xp: number
    wins?: number
}

interface AchievementsProps {
    characters: CharacterSummary[]
    bestWave?: number
    perfectRun?: boolean
}

interface Achievement {
    id: string
    label: string
    description: string
    icon: string
    color: string
}

const ACHIEVEMENT_DEFS: Achievement[] = [
    {
        id: 'survivor',
        label: 'Sobrevivente',
        description: 'Alcançou a Onda 10',
        icon: '🗡️',
        color: 'from-blue-700 to-blue-900 border-blue-600',
    },
    {
        id: 'immortal',
        label: 'Imortal',
        description: 'Alcançou a Onda 20',
        icon: '💀',
        color: 'from-purple-700 to-purple-900 border-purple-600',
    },
    {
        id: 'perfect',
        label: 'Perfect Warrior',
        description: 'Completou uma onda sem errar nenhum prompt',
        icon: '✦',
        color: 'from-emerald-600 to-emerald-900 border-emerald-500',
    },
    {
        id: 'legendary',
        label: 'Lendário',
        description: 'Possui um personagem no nível 20',
        icon: '👑',
        color: 'from-amber-500 to-amber-800 border-amber-400',
    },
    {
        id: 'mentor',
        label: 'Mentor',
        description: '3 ou mais personagens no nível 10+',
        icon: '📚',
        color: 'from-rose-600 to-rose-900 border-rose-500',
    },
]

function checkAchievements(
    characters: CharacterSummary[],
    bestWave: number,
    perfectRun: boolean
): Set<string> {
    const unlocked = new Set<string>()

    if (bestWave >= 10) unlocked.add('survivor')
    if (bestWave >= 20) unlocked.add('immortal')
    if (perfectRun) unlocked.add('perfect')
    if (characters.some(c => getLevel(c.xp) >= 20)) unlocked.add('legendary')
    if (characters.filter(c => getLevel(c.xp) >= 10).length >= 3) unlocked.add('mentor')

    return unlocked
}

export function Achievements({ characters, bestWave = 0, perfectRun = false }: AchievementsProps) {
    const unlocked = useMemo(
        () => checkAchievements(characters, bestWave, perfectRun),
        [characters, bestWave, perfectRun]
    )

    const unlockedList = ACHIEVEMENT_DEFS.filter(a => unlocked.has(a.id))

    if (unlockedList.length === 0) return null

    return (
        <div className="flex flex-col gap-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Conquistas</h3>
            <div className="flex flex-wrap gap-2">
                {unlockedList.map((ach, i) => (
                    <motion.div
                        key={ach.id}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', delay: i * 0.08 }}
                        title={ach.description}
                        className={`flex items-center gap-2 rounded-xl border bg-gradient-to-br px-3 py-2 ${ach.color}`}
                    >
                        <span className="text-lg">{ach.icon}</span>
                        <div className="flex flex-col">
                            <span className="text-xs font-black text-white leading-tight">{ach.label}</span>
                            <span className="text-[10px] text-white/60 leading-tight">{ach.description}</span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
