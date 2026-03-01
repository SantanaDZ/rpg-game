"use client"

import { useDragControls } from "framer-motion"
import { Reorder } from "framer-motion"
import { GripVertical } from "lucide-react"
import { Shield, Swords, Brain, Zap, Heart } from "lucide-react"
import { PixelCharacterAvatar } from "@/components/pixel-character-avatar"
import { CATEGORIES } from "@/lib/game-constants"
import type { Character } from "@/types/game"

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
    strength: <Swords className="h-3 w-3" />,
    intelligence: <Brain className="h-3 w-3" />,
    agility: <Zap className="h-3 w-3" />,
    endurance: <Shield className="h-3 w-3" />,
    charisma: <Heart className="h-3 w-3" />,
}

function AttribSelector({ selected, onChange }: {
    selected: typeof CATEGORIES[number]
    onChange: (attr: typeof CATEGORIES[number]) => void
}) {
    return (
        <div className="flex gap-1 mt-2">
            {CATEGORIES.map(cat => (
                <button
                    key={cat.id}
                    onClick={() => onChange(cat)}
                    title={`Atacar com ${cat.label}`}
                    className={`flex flex-col items-center px-1.5 py-1 rounded transition-all ${selected.id === cat.id
                        ? 'bg-amber-500 text-slate-900 shadow shadow-amber-900/40'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        }`}
                >
                    {CATEGORY_ICONS[cat.id]}
                    <span className="text-[9px] font-bold mt-0.5">{cat.label.slice(0, 3)}</span>
                </button>
            ))}
        </div>
    )
}

interface DraggableCharCardProps {
    charId: string
    char: Character
    attackAttr: typeof CATEGORIES[number]
    onAttrChange: (attr: typeof CATEGORIES[number]) => void
}

export function DraggableCharCard({ charId, char, attackAttr, onAttrChange }: DraggableCharCardProps) {
    const controls = useDragControls()
    return (
        <Reorder.Item
            value={charId}
            dragListener={false}
            dragControls={controls}
            className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 list-none"
        >
            <div className="flex items-start gap-2">
                <div
                    onPointerDown={e => controls.start(e)}
                    className="mt-3 cursor-grab touch-none text-slate-600 hover:text-slate-400 active:cursor-grabbing flex-shrink-0"
                >
                    <GripVertical className="h-4 w-4" />
                </div>
                <PixelCharacterAvatar type={char.character_type} className="w-20 h-20 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">{char.name}</p>
                    <p className="text-[10px] text-slate-500">Vit: {char.wins ?? 0}</p>
                    <AttribSelector selected={attackAttr} onChange={onAttrChange} />
                </div>
            </div>
        </Reorder.Item>
    )
}
