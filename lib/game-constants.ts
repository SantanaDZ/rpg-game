export const INITIAL_MAX_POINTS = 25
export const POINTS_PER_LEVEL = 3
export const MAX_LEVEL = 20
export const XP_PER_WIN = 50

export const CATEGORIES = [
    { id: 'strength', label: 'Forca', icon: 'Swords' },
    { id: 'intelligence', label: 'Inteligencia', icon: 'Brain' },
    { id: 'agility', label: 'Agilidade', icon: 'Zap' },
    { id: 'endurance', label: 'Resistencia', icon: 'Shield' },
    { id: 'charisma', label: 'Carisma', icon: 'Heart' },
] as const

export const CHARACTER_TYPES = [
    {
        value: "knight",
        label: "Cavaleiro",
        isPlayable: true,
        image: "/cavaleiro.png",
        baseStats: { strength: 8, intelligence: 4, agility: 5, endurance: 8, charisma: 5 },
        maxStats: { strength: 20, intelligence: 10, agility: 12, endurance: 20, charisma: 12 }
    },
    {
        value: "archer",
        label: "Arqueira",
        isPlayable: true,
        image: "/arqueira.png",
        baseStats: { strength: 4, intelligence: 5, agility: 9, endurance: 4, charisma: 8 },
        maxStats: { strength: 10, intelligence: 12, agility: 25, endurance: 10, charisma: 18 }
    },
    {
        value: "wizard",
        label: "Mago",
        isPlayable: false,
        unlockCost: 500,
        image: "/mago.png",
        baseStats: { strength: 3, intelligence: 9, agility: 5, endurance: 3, charisma: 10 },
        maxStats: { strength: 8, intelligence: 25, agility: 12, endurance: 8, charisma: 25 }
    },
    {
        value: "skeleton",
        label: "Esqueleto",
        isPlayable: false,
        unlockCost: 300,
        image: "/esqueleto.png",
        baseStats: { strength: 6, intelligence: 3, agility: 7, endurance: 5, charisma: 4 },
        maxStats: { strength: 15, intelligence: 8, agility: 18, endurance: 12, charisma: 8 }
    },
    {
        value: "tank",
        label: "Tanque",
        isPlayable: false,
        unlockCost: 800,
        image: "/tanque.png",
        baseStats: { strength: 10, intelligence: 2, agility: 3, endurance: 10, charisma: 5 },
        maxStats: { strength: 25, intelligence: 6, agility: 8, endurance: 30, charisma: 10 }
    },
    {
        value: "king",
        label: "Rei",
        isPlayable: true,
        image: "/rei.png",
        baseStats: { strength: 6, intelligence: 6, agility: 5, endurance: 6, charisma: 7 },
        maxStats: { strength: 18, intelligence: 18, agility: 12, endurance: 18, charisma: 25 }
    },
    {
        value: "queen",
        label: "Rainha",
        isPlayable: true,
        image: "/rainha.png",
        baseStats: { strength: 4, intelligence: 8, agility: 6, endurance: 4, charisma: 8 },
        maxStats: { strength: 12, intelligence: 25, agility: 18, endurance: 12, charisma: 25 }
    },
    {
        value: "ogre",
        label: "Ogro",
        isPlayable: false,
        unlockCost: 1000,
        image: "/ogro.png",
        baseStats: { strength: 12, intelligence: 1, agility: 2, endurance: 12, charisma: 3 },
        maxStats: { strength: 30, intelligence: 5, agility: 8, endurance: 25, charisma: 8 }
    },
]

export function getLevel(xp: number = 0) {
    return Math.floor(xp / 100) + 1
}

export function getMaxPoints(level: number) {
    const cappedLevel = Math.min(level, MAX_LEVEL)
    return INITIAL_MAX_POINTS + (cappedLevel - 1) * POINTS_PER_LEVEL
}

export function isMaxLevel(xp: number) {
    return getLevel(xp) >= MAX_LEVEL
}

export function calculateEffectiveStats(character: any) {
    const defense = DEFENSE_POWERS.find(d => d.value === character.armor_type) || DEFENSE_POWERS[0]
    const attack = ATTACK_POWERS.find(a => a.value === character.weapon_type) || ATTACK_POWERS[0]

    return {
        strength: Math.max(1, character.strength + defense.str + attack.str),
        intelligence: Math.max(1, character.intelligence + defense.int + attack.int),
        agility: Math.max(1, character.agility + defense.agi + attack.agi),
        endurance: Math.max(1, character.endurance + defense.end + attack.end),
        charisma: Math.max(1, character.charisma + defense.cha + attack.cha),
        hp: character.strength + character.intelligence + character.agility + character.endurance + character.charisma + defense.hp
    }
}

export const DEFENSE_POWERS = [
    { value: "none", label: "Nenhum", hp: 0, str: 0, int: 0, agi: 0, end: 0, cha: 0 },
    { value: "regen", label: "Regeneracao", hp: 20, str: 0, int: 0, agi: 0, end: 0, cha: 0 },
    { value: "ice_shield", label: "Escudo de Gelo", hp: 10, str: 0, int: 0, agi: -2, end: 5, cha: 0 },
    { value: "divine_guard", label: "Protecao Divina", hp: 5, str: 0, int: 0, agi: 0, end: 0, cha: 5 },
    { value: "oak_skin", label: "Pele de Carvalho", hp: 0, str: 0, int: 0, agi: -3, end: 8, cha: 0 },
]

export const ATTACK_POWERS = [
    { value: "none", label: "Nenhum", str: 0, int: 0, agi: 0, end: 0, cha: 0 },
    { value: "poison", label: "Envenenamento", str: 2, int: 0, agi: 3, end: 0, cha: 0 },
    { value: "shadow_fury", label: "Furia Sombria", str: 6, int: 0, agi: -2, end: 0, cha: -1 },
    { value: "accuracy", label: "Precisao Extrema", str: -2, int: 0, agi: 7, end: 0, cha: 0 },
    { value: "arcane_ray", label: "Raio Arcano", str: -2, int: 8, agi: 0, end: -1, cha: 0 },
]
