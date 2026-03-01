"use client"

import { motion, AnimatePresence } from "framer-motion"

export function KeyboardHint() {
    return (
        <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500">
            <span>💡 Durante o combate, pressione</span>
            <div className="flex flex-col items-center gap-0.5">
                <div className="flex gap-0.5">
                    <kbd className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] text-slate-300 border border-slate-700">W</kbd>
                </div>
                <div className="flex gap-0.5">
                    <kbd className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] text-slate-300 border border-slate-700">A</kbd>
                    <kbd className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] text-slate-300 border border-slate-700">S</kbd>
                    <kbd className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] text-slate-300 border border-slate-700">D</kbd>
                </div>
            </div>
            <span>ou</span>
            <div className="flex flex-col items-center gap-0.5">
                <div className="flex gap-0.5">
                    <kbd className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] text-slate-300 border border-slate-700">↑</kbd>
                </div>
                <div className="flex gap-0.5">
                    <kbd className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] text-slate-300 border border-slate-700">←</kbd>
                    <kbd className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] text-slate-300 border border-slate-700">↓</kbd>
                    <kbd className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] text-slate-300 border border-slate-700">→</kbd>
                </div>
            </div>
            <span>para ganhar bônus!</span>
        </div>
    )
}

export function BoostScoreFloat({ delta }: { delta: number | null }) {
    return (
        <AnimatePresence>
            {delta !== null && (
                <motion.div
                    key={delta + Math.random()}
                    initial={{ opacity: 1, y: 0, scale: 1 }}
                    animate={{ opacity: 0, y: -60, scale: 1.3 }}
                    transition={{ duration: 1.1, ease: 'easeOut' }}
                    className="pointer-events-none absolute top-[-20px] left-1/2 -translate-x-1/2 z-50"
                >
                    <span className="text-2xl font-black text-emerald-400 drop-shadow-lg">
                        +{delta} pts!
                    </span>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
