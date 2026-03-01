"use client"

import { motion, AnimatePresence } from "framer-motion"
import type { ActionPrompt } from "@/types/game"

const PROMPT_COLORS: Record<string, string> = {
    w: 'from-amber-500 to-orange-600',
    s: 'from-blue-500 to-indigo-600',
    a: 'from-purple-500 to-violet-600',
    d: 'from-rose-500 to-pink-600',
}

const KEY_DISPLAY: Record<string, string> = { w: 'W / ↑', s: 'S / ↓', a: 'A / ←', d: 'D / →' }

const ACTION_PROMPTS_DISPLAY = [
    { key: 'w', label: 'ATACAR', icon: '⚔️' },
    { key: 's', label: 'DEFENDER', icon: '🛡️' },
    { key: 'a', label: 'ESQUIVAR', icon: '⚡' },
    { key: 'd', label: 'MAGIA', icon: '🔥' },
]

interface ActionPromptOverlayProps {
    prompt: ActionPrompt | null
    result: 'HIT' | 'MISS' | null
    onMobileAction: (key: string) => void
}

export function ActionPromptOverlay({ prompt, result, onMobileAction }: ActionPromptOverlayProps) {
    return (
        <AnimatePresence>
            {prompt && (
                <motion.div
                    key={prompt.key + prompt.boost}
                    initial={{ opacity: 0, scale: 0.7, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.85, y: -10 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className="my-4 flex flex-col items-center gap-3"
                >
                    {/* Result badge */}
                    {result && (
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className={`text-xl font-black tracking-widest ${result === 'HIT' ? 'text-emerald-400' : 'text-red-400'}`}
                        >
                            {result === 'HIT' ? '✦ PERFEITO!' : '✘ ERROU!'}
                        </motion.div>
                    )}

                    {/* Main prompt card */}
                    {!result && (
                        <motion.div
                            animate={{ scale: [1, 1.04, 1] }}
                            transition={{ duration: 0.4, repeat: Infinity }}
                            className={`flex flex-col items-center gap-2 rounded-2xl bg-gradient-to-br ${PROMPT_COLORS[prompt.key]} px-8 py-5 shadow-2xl`}
                        >
                            <span className="text-4xl">{prompt.icon}</span>
                            <span className="text-2xl font-black tracking-wider text-white">{prompt.label}</span>
                            <span className="text-base font-bold text-white/70">
                                Pressione <kbd className="rounded bg-black/30 px-2 py-0.5 font-mono">{KEY_DISPLAY[prompt.key]}</kbd>
                            </span>
                        </motion.div>
                    )}

                    {/* Mobile buttons — always visible */}
                    <div className="flex gap-2 mt-1">
                        {ACTION_PROMPTS_DISPLAY.map(p => (
                            <button
                                key={p.key}
                                onClick={() => onMobileAction(p.key)}
                                className={`flex flex-col items-center rounded-xl px-4 py-2 text-xs font-bold transition-all
                                    ${prompt.key === p.key && !result
                                        ? `bg-gradient-to-br ${PROMPT_COLORS[p.key]} text-white scale-110 shadow-lg`
                                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                            >
                                <span className="text-lg">{p.icon}</span>
                                <span>{p.label}</span>
                                <span className="text-[10px] opacity-60">{KEY_DISPLAY[p.key]}</span>
                            </button>
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
