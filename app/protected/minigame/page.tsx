"use client"

import { useRouter } from "next/navigation"
import SpaceInvadersGame from "@/components/space-invaders-game"

export default function MinigamePage() {
    const router = useRouter()

    return (
        <SpaceInvadersGame
            onBack={() => router.push("/protected")}
            themeColor="#f59e0b" // amber-500
        />
    )
}
