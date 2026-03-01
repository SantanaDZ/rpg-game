import type { CATEGORIES } from "@/lib/game-constants"

export interface Character {
    id: string
    user_id?: string
    name: string
    strength: number
    intelligence: number
    agility: number
    endurance: number
    charisma: number
    skin_color?: string
    hair_color?: string
    hair_style?: string
    eye_color?: string
    armor_type: string
    weapon_type: string
    character_type: string
    xp: number
    wins?: number
    [key: string]: any
}

export interface Mob {
    id: string
    name: string
    character_type: string
    strength: number
    intelligence: number
    agility: number
    endurance: number
    charisma: number
    armor_type: string
    weapon_type: string
}

export interface MatchupResult {
    playerCharId: string
    playerCharName: string
    mobName: string
    attackAttribute: typeof CATEGORIES[number]
    playerStat: number
    mobStat: number
    winner: 'player' | 'mob'
    critical: boolean
    boosted?: boolean
}

export type DungeonPhase = 'PREP' | 'FIGHTING' | 'WAVE_CLEAR' | 'GAME_OVER'

export type BoostType = 'ATTACK' | 'DEFEND' | 'DODGE' | 'MAGIC'

export interface ActionPrompt {
    key: string
    label: string
    boost: BoostType
    icon: string
}
