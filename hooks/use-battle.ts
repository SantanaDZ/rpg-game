"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { calculateEffectiveStats, CATEGORIES, CHARACTER_TYPES } from "@/lib/game-constants"
import type { Character, Mob, MatchupResult, DungeonPhase, BoostType, ActionPrompt } from "@/types/game"

export type { Mob, MatchupResult, DungeonPhase, BoostType, ActionPrompt }

type BattleCategory = typeof CATEGORIES[number]

// ── Class-specific mob name pools ──────────────────────────────────────────────

const MOB_NAME_BY_TYPE: Record<string, string[][]> = {
    // [tier 1 (waves 1-5), tier 2 (6-10), tier 3 (11-15), tier 4 (16+)]
    skeleton: [
        ["Esqueleto Vagabundo", "Ossos da Morte", "Crânio Putrefato", "Zumbi Cadavérico"],
        ["Guerreiro Esquelético", "Lich Aprendiz", "Morto-Vivo Errante", "Espectro Ósseo"],
        ["Cavaleiro da Morte", "Senhor dos Mortos", "Espectra Ancião", "Lich das Sombras"],
        ["Lich Supremo", "Ceifador Eterno", "Rei Esquelético", "Deus dos Mortos-Vivos"],
    ],
    ogre: [
        ["Ogro Bêbado", "Gigante das Pedras", "Brutamontes da Lama", "Guardião Lerdo"],
        ["Ogro Raivoso", "Troll das Cavernas", "Gigante Berserker", "Ogre de Ferro"],
        ["Ogro Ancião", "Colosso das Ruínas", "Troll Supremo", "Gigante do Abismo"],
        ["Ogro Divino", "Rei dos Colossus", "Guardião das Trevas", "Titã Corrupto"],
    ],
    wizard: [
        ["Aprendiz de Magia", "Feiticeiro Recluso", "Mago Corrupto", "Bruxo Errante"],
        ["Conjurador das Sombras", "Arquimago do Caos", "Necromante Iniciante", "Lich Fraco"],
        ["Senhor do Caos", "Necromante Supremo", "Arquimago das Trevas", "Oráculo Corrompido"],
        ["Deus do Caos", "Lich Imortal", "Destruidor Arcano", "Profeta das Trevas"],
    ],
    tank: [
        ["Golem de Argila", "Guardião de Pedra", "Sentinela Enferrujada", "Colossus Menor"],
        ["Golem de Ferro", "Guardião de Aço", "Colossus Raivoso", "Sentinela do Abismo"],
        ["Golem de Diamante", "Senhor de Ferro", "Colossus Ancião", "Guardião Eterno"],
        ["Colossus Supremo", "Golem Divino", "Titã de Pedra", "Guardião Imortal"],
    ],
}

const FALLBACK_NAMES = [
    ["Criatura Sombria", "Monstro das Cavernas", "Demônio Menor", "Espírito Maligno"],
    ["Demônio das Trevas", "Criatura do Caos", "Monstro Ancião", "Entidade Maligna"],
    ["Senhor das Sombras", "Criatura do Abismo", "Dragão Jovem", "Demon Lord Menor"],
    ["Arquidemônio", "Deus das Trevas", "Destruidor Supremo", "Caos Encarnado"],
]

function getMobName(type: string, wave: number): string {
    const tierIndex = Math.min(3, Math.floor((wave - 1) / 5))
    const pool = MOB_NAME_BY_TYPE[type] ?? FALLBACK_NAMES
    const names = pool[tierIndex]
    return names[Math.floor(Math.random() * names.length)]
}

// ── Enemy types only ──────────────────────────────────────────────────────────

const ENEMY_TYPES = CHARACTER_TYPES.filter(t => !t.isPlayable)

// Bug #8 fix: use actual DEFENSE_POWERS / ATTACK_POWERS values
const ARMOR_POOL = ["none", "regen", "ice_shield", "divine_guard", "oak_skin"]
const WEAPON_POOL = ["none", "poison", "shadow_fury", "accuracy", "arcane_ray"]

// ── Mob generation with aggressive scaling ─────────────────────────────────────

function generateMobs(wave: number, playerTeam: Character[]): Mob[] {
    const teamEffective = playerTeam.map(c => calculateEffectiveStats(c))
    const avgStats = CATEGORIES.reduce((acc, cat) => {
        const avg = teamEffective.reduce((sum, eff) => sum + (eff[cat.id as keyof typeof eff] as number), 0) / playerTeam.length
        acc[cat.id] = avg
        return acc
    }, {} as Record<string, number>)

    // Aggressive growth: wave 1 ≈ 1.0x, wave 5 ≈ 1.6x, wave 10 ≈ 2.4x, wave 20 ≈ 4.6x
    const scaleFactor = 1.0 + (wave * 0.08) + Math.pow(wave / 10, 2) * 0.4

    return Array.from({ length: 3 }, (_, i) => {
        const randomVariance = () => 0.85 + Math.random() * 0.3 // 0.85 – 1.15
        const enemyType = ENEMY_TYPES[Math.floor(Math.random() * ENEMY_TYPES.length)]

        // Higher waves ensure better gear
        const armorTier = Math.min(4, Math.floor(wave / 4))
        const weaponTier = Math.min(4, Math.floor(wave / 4))

        return {
            id: `mob-w${wave}-${i}`,
            name: getMobName(enemyType.value, wave),
            character_type: enemyType.value,
            strength: Math.max(1, Math.round(avgStats.strength * scaleFactor * randomVariance())),
            intelligence: Math.max(1, Math.round(avgStats.intelligence * scaleFactor * randomVariance())),
            agility: Math.max(1, Math.round(avgStats.agility * scaleFactor * randomVariance())),
            endurance: Math.max(1, Math.round(avgStats.endurance * scaleFactor * randomVariance())),
            charisma: Math.max(1, Math.round(avgStats.charisma * scaleFactor * randomVariance())),
            armor_type: ARMOR_POOL[Math.min(armorTier, ARMOR_POOL.length - 1)],
            weapon_type: WEAPON_POOL[Math.min(weaponTier, WEAPON_POOL.length - 1)],
        }
    })
}

// ── Action prompt definitions ─────────────────────────────────────────────────

const ACTION_PROMPTS: ActionPrompt[] = [
    { key: 'w', label: 'ATACAR!', boost: 'ATTACK', icon: '⚔️' },
    { key: 's', label: 'DEFENDER!', boost: 'DEFEND', icon: '🛡️' },
    { key: 'a', label: 'ESQUIVAR!', boost: 'DODGE', icon: '⚡' },
    { key: 'd', label: 'MAGIA!', boost: 'MAGIC', icon: '🔥' },
]

function pickRandomPrompt(): ActionPrompt {
    return ACTION_PROMPTS[Math.floor(Math.random() * ACTION_PROMPTS.length)]
}

// ── Apply boost to combat stat inputs ────────────────────────────────────────

function applyBoostToStats(
    playerStat: number,
    mobStat: number,
    boost: BoostType
): { playerStat: number; mobStat: number } {
    switch (boost) {
        case 'ATTACK': return { playerStat: Math.round(playerStat * 1.2), mobStat }
        case 'DEFEND': return { playerStat, mobStat: Math.round(mobStat * 0.85) }
        case 'DODGE': return { playerStat, mobStat: Math.round(mobStat * 0.9) }
        case 'MAGIC': return { playerStat: Math.round(playerStat * 1.15), mobStat: Math.round(mobStat * 0.9) }
    }
}

// ── Pure combat resolver ───────────────────────────────────────────────────────

export function resolveDungeonMatchup(
    char: Character,
    mob: Mob,
    attr: BattleCategory,
    boost?: BoostType
): Pick<MatchupResult, 'playerStat' | 'mobStat' | 'winner' | 'critical' | 'boosted'> {
    const pEff = calculateEffectiveStats(char)
    const mEff = calculateEffectiveStats(mob)
    let playerStat = pEff[attr.id as keyof typeof pEff] as number
    let mobStat = mEff[attr.id as keyof typeof mEff] as number

    let boosted = false
    if (boost) {
        const boosted_ = applyBoostToStats(playerStat, mobStat, boost)
        playerStat = boosted_.playerStat
        mobStat = boosted_.mobStat
        boosted = true
    }

    return {
        playerStat,
        mobStat,
        winner: playerStat >= mobStat ? 'player' : 'mob',
        critical: Math.abs(playerStat - mobStat) >= 5,
        boosted,
    }
}

// ── Speed multipliers ──────────────────────────────────────────────────────────

export type BattleSpeed = 'slow' | 'normal' | 'fast'

const SPEED_MULTIPLIER: Record<BattleSpeed, number> = {
    slow: 2,
    normal: 1,
    fast: 0.4,
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useDungeon(characters: Character[], speed: BattleSpeed = 'normal') {
    const [wave, setWave] = useState(1)
    const [bestWave, setBestWave] = useState(1)

    useEffect(() => {
        const saved = localStorage.getItem('rpg_dungeon_best_wave')
        if (saved) setBestWave(parseInt(saved, 10))
    }, [])

    const updateBestWave = useCallback((currentWave: number) => {
        setBestWave(prev => {
            const next = Math.max(prev, currentWave)
            localStorage.setItem('rpg_dungeon_best_wave', next.toString())
            return next
        })
    }, [])

    const [phase, setPhase] = useState<DungeonPhase>('PREP')
    const [mobs, setMobs] = useState<Mob[]>([])

    const [characterOrder, setCharacterOrder] = useState<string[]>([])
    const [attackAttributes, setAttackAttributes] = useState<Record<string, BattleCategory>>({})
    const [matchupResults, setMatchupResults] = useState<MatchupResult[]>([])
    const [currentMatchup, setCurrentMatchup] = useState(-1)

    // ── Interactive prompt state ──────────────────────────────────────────────
    const [activePrompt, setActivePrompt] = useState<ActionPrompt | null>(null)
    const [promptResult, setPromptResult] = useState<'HIT' | 'MISS' | null>(null)
    const [perfectRun, setPerfectRun] = useState(false)
    const promptResolveFnRef = useRef<((boost: BoostType | null) => void) | null>(null)
    // Bug #2 fix: track the active timeout so we can clear it on unmount
    const activeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    // Cleanup on unmount — prevents setState on unmounted component
    useEffect(() => {
        return () => {
            if (activeTimeoutRef.current) {
                clearTimeout(activeTimeoutRef.current)
            }
            promptResolveFnRef.current = null
        }
    }, [])

    // Register key listener during FIGHTING; resolves the current prompt
    useEffect(() => {
        if (phase !== 'FIGHTING') return

        function onKey(e: KeyboardEvent) {
            const key = e.key.toLowerCase()
            if (!['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) return
            if (!promptResolveFnRef.current || !activePrompt) return

            const normalised = key.replace('arrow', '') === 'up' ? 'w'
                : key.replace('arrow', '') === 'down' ? 's'
                    : key.replace('arrow', '') === 'left' ? 'a'
                        : key.replace('arrow', '') === 'right' ? 'd'
                            : key

            const correct = normalised === activePrompt.key
            setPromptResult(correct ? 'HIT' : 'MISS')
            const resolve = promptResolveFnRef.current
            promptResolveFnRef.current = null
            resolve(correct ? activePrompt.boost : null)
        }

        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [phase, activePrompt])

    // Mobile tap handler — expose via return
    const handleMobileAction = useCallback((key: string) => {
        if (!promptResolveFnRef.current || !activePrompt) return
        const correct = key === activePrompt.key
        setPromptResult(correct ? 'HIT' : 'MISS')
        const resolve = promptResolveFnRef.current
        promptResolveFnRef.current = null
        resolve(correct ? activePrompt.boost : null)
    }, [activePrompt])

    // Initialise once characters are loaded
    useEffect(() => {
        if (characters.length === 0) return
        setCharacterOrder(characters.map(c => c.id))
        const defaults: Record<string, BattleCategory> = {}
        characters.forEach(c => { defaults[c.id] = CATEGORIES[0] })
        setAttackAttributes(defaults)
        setMobs(generateMobs(1, characters))
    }, [characters.map(c => c.id).join(',')])  // eslint-disable-line react-hooks/exhaustive-deps

    const setAttackAttribute = useCallback((charId: string, attr: BattleCategory) => {
        setAttackAttributes(prev => ({ ...prev, [charId]: attr }))
    }, [])

    const swapCharacters = useCallback((indexA: number, indexB: number) => {
        setCharacterOrder(prev => {
            const next = [...prev]
                ;[next[indexA], next[indexB]] = [next[indexB], next[indexA]]
            return next
        })
    }, [])

    const reorderCharacters = useCallback((newOrder: string[]) => {
        setCharacterOrder(newOrder)
    }, [])

    // ── Main fight loop ───────────────────────────────────────────────────────

    const startFight = useCallback(async () => {
        if (phase !== 'PREP' || characters.length < 3) return
        setPhase('FIGHTING')
        setMatchupResults([])
        setPerfectRun(false)
        let allHit = true

        const mult = SPEED_MULTIPLIER[speed]
        const results: MatchupResult[] = []

        for (let i = 0; i < characterOrder.length; i++) {
            setCurrentMatchup(i)
            setActivePrompt(null)
            setPromptResult(null)

            // Show action prompt for 800ms (adjusted by speed)
            const prompt = pickRandomPrompt()
            setActivePrompt(prompt)

            const boost = await new Promise<BoostType | null>(resolve => {
                promptResolveFnRef.current = resolve
                // Bug #2 fix: save timeout ID for cleanup
                const timeoutId = setTimeout(() => {
                    if (promptResolveFnRef.current) {
                        promptResolveFnRef.current = null
                        resolve(null)
                    }
                }, Math.round(800 * mult))
                activeTimeoutRef.current = timeoutId
            })

            if (!boost) allHit = false
            setActivePrompt(null)

            // Buffer between prompt and resolution
            await new Promise(resolve => setTimeout(resolve, Math.round(400 * mult)))

            const char = characters.find(c => c.id === characterOrder[i])
            if (!char) continue
            const mob = mobs[i]
            const attr = attackAttributes[characterOrder[i]] ?? CATEGORIES[0]

            const resolved = resolveDungeonMatchup(char, mob, attr, boost ?? undefined)

            results.push({
                playerCharId: char.id,
                playerCharName: char.name,
                mobName: mob.name,
                attackAttribute: attr,
                ...resolved,
            })
            setMatchupResults([...results])

            await new Promise(resolve => setTimeout(resolve, Math.round(600 * mult)))
        }

        if (allHit) setPerfectRun(true)
        setCurrentMatchup(-1)
        await new Promise(resolve => setTimeout(resolve, Math.round(600 * mult)))

        const playerWins = results.filter(r => r.winner === 'player').length
        if (playerWins >= 2) {
            setPhase('WAVE_CLEAR')
        } else {
            updateBestWave(wave)
            setPhase('GAME_OVER')
        }
    }, [phase, characters, characterOrder, mobs, attackAttributes, wave, speed])

    const nextWave = useCallback(() => {
        const next = wave + 1
        setWave(next)
        setMobs(generateMobs(next, characters))
        setMatchupResults([])
        setCurrentMatchup(-1)
        setActivePrompt(null)
        setPromptResult(null)
        setPhase('PREP')
    }, [wave, characters])

    const restartDungeon = useCallback(() => {
        updateBestWave(wave)
        setWave(1)
        setMobs(generateMobs(1, characters))
        setMatchupResults([])
        setCurrentMatchup(-1)
        setActivePrompt(null)
        setPromptResult(null)
        setPhase('PREP')
    }, [wave, characters])

    return {
        wave,
        bestWave,
        phase,
        mobs,
        characterOrder,
        attackAttributes,
        matchupResults,
        currentMatchup,
        activePrompt,
        promptResult,
        perfectRun,
        startFight,
        nextWave,
        restartDungeon,
        swapCharacters,
        reorderCharacters,
        setAttackAttribute,
        handleMobileAction,
    }
}
