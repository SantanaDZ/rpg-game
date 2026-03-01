"use client"

import { useEffect, useState } from "react"
import { CHARACTER_TYPES } from "@/lib/game-constants"

export function LoadingScreen() {
    const [loading, setLoading] = useState(true)
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        // Preload all character images from constants
        const imagesToLoad = CHARACTER_TYPES.map(t => t.image)
        let loadedCount = 0

        if (imagesToLoad.length === 0) {
            setLoading(false)
            return
        }

        const loadImage = (src: string) => {
            return new Promise((resolve) => {
                const img = new Image()
                img.src = src
                img.onload = resolve
                img.onerror = resolve // Continue even if one fails
            })
        }

        const loadAll = async () => {
            for (const src of imagesToLoad) {
                await loadImage(src)
                loadedCount++
                setProgress(Math.round((loadedCount / imagesToLoad.length) * 100))
            }
            // Add a small delay for smooth transition
            setTimeout(() => setLoading(false), 500)
        }

        loadAll()
    }, [])

    if (!loading) return null

    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-950 text-white">
            <div className="w-64 h-2 bg-slate-800 rounded-full overflow-hidden mb-4">
                <div
                    className="h-full bg-amber-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                />
            </div>
            <p className="font-serif text-lg font-bold tracking-widest animate-pulse">
                CARREGANDO AVENTURA... {progress}%
            </p>
            <p className="text-xs text-slate-500 mt-2 uppercase tracking-tighter">
                Preparando assets de alta qualidade
            </p>
        </div>
    )
}
