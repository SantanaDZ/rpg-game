"use client"

import React from "react"
import { CHARACTER_TYPES } from "@/lib/game-constants"

interface PixelCharacterAvatarProps {
    type?: string
    skinColor?: string // Keep for legacy prop safety
    className?: string
}

/**
 * PixelCharacterAvatar - Renders the character's PNG artwork.
 * The artwork is preloaded by the LoadingScreen.
 */
export const PixelCharacterAvatar = React.memo(function PixelCharacterAvatar({
    type = "knight",
    className = "",
}: PixelCharacterAvatarProps) {

    const charType = CHARACTER_TYPES.find(t => t.value === type) || CHARACTER_TYPES[0]

    return (
        <div className={`relative aspect-square overflow-hidden rounded-xl bg-slate-900/40 border border-white/5 shadow-inner ${className}`}>
            <img
                src={charType.image}
                alt={charType.label}
                className={`w-full h-full transition-transform duration-500 hover:scale-110 object-cover [image-rendering:pixelated]`}
                loading="eager"
            />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-slate-950/80 to-transparent pointer-events-none" />
        </div>
    )
})
