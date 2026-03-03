"use client"
import { useEffect, useRef, useState, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Rocket, Skull, Swords, Shield, Heart, Zap, Brain, ArrowLeft, ArrowRight, Play } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { calculateEffectiveStats, CHARACTER_TYPES, getLevel } from "@/lib/game-constants"
import { PixelCharacterAvatar } from "@/components/pixel-character-avatar"

const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 600
const PLAYER_WIDTH = 48
const PLAYER_HEIGHT = 48
const BULLET_WIDTH = 6
const BULLET_HEIGHT = 16
const INVADER_WIDTH = 40
const INVADER_HEIGHT = 40
const INVADER_ROWS = 4
const INVADER_COLS = 8
// Base speeds (will be modified by stats)
const BASE_PLAYER_SPEED = 5
const BASE_BULLET_SPEED = 7
const BASE_INVADER_SPEED = 1

interface Character {
  id: string
  name: string
  strength: number
  intelligence: number
  agility: number
  endurance: number
  charisma: number
  skin_color: string
  hair_color: string
  hair_style: string
  eye_color: string
  armor_type: string
  weapon_type: string
  character_type: string
  xp: number
  wins: number
  created_at: string
}

interface Player {
  x: number
  y: number
  width: number
  height: number
}

interface Bullet {
  x: number
  y: number
  width: number
  height: number
  speed: number
  isPlayerBullet: boolean
}

interface Invader {
  x: number
  y: number
  width: number
  height: number
  alive: boolean
  type: number // Used to pick enemy image
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  color: string
}

interface SpaceInvadersGameProps {
  onBack: () => void
  themeColor?: string
}

const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = src
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Failed to load ${src}`))
  })
}

export default function SpaceInvadersGame({ onBack, themeColor = "#cbd5e1" }: SpaceInvadersGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gameLoopRef = useRef<number | undefined>(undefined)

  const [gameState, setGameState] = useState<"loading" | "selection" | "menu" | "loading_assets" | "playing" | "gameOver" | "won">("loading")
  const [characters, setCharacters] = useState<Character[]>([])
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null)

  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [wave, setWave] = useState(1)
  const [highScore, setHighScore] = useState(0)

  // Assets refs
  const assetsRef = useRef<{
    playerImg: HTMLImageElement | null
    enemyImgs: HTMLImageElement[]
    bgImg: HTMLImageElement | null
  }>({
    playerImg: null,
    enemyImgs: [],
    bgImg: null
  })

  const gameStateRef = useRef<{
    player: Player
    bullets: Bullet[]
    invaders: Invader[]
    particles: Particle[]
    score: number
    lives: number
    wave: number
    invaderDirection: number
    lastInvaderMove: number
    lastInvaderShot: number
    canvas: HTMLCanvasElement | null
    ctx: CanvasRenderingContext2D | null
    keys: Set<string>
  }>({
    player: {
      x: CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2,
      y: CANVAS_HEIGHT - 60,
      width: PLAYER_WIDTH,
      height: PLAYER_HEIGHT,
    },
    bullets: [],
    invaders: [],
    particles: [],
    score: 0,
    lives: 3,
    wave: 1,
    invaderDirection: 1,
    lastInvaderMove: 0,
    lastInvaderShot: 0,
    canvas: null,
    ctx: null,
    keys: new Set(),
  })

  useEffect(() => {
    const fetchChars = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase.from("characters").select("*").eq("user_id", user.id).order("created_at", { ascending: false })
        setCharacters(data || [])
      }
      setGameState("selection")
    }
    fetchChars()
  }, [])

  const effectiveStats = useMemo(() => {
    if (!selectedCharacter) return null
    return calculateEffectiveStats(selectedCharacter)
  }, [selectedCharacter])

  const gameModifiers = useMemo(() => {
    if (!effectiveStats) return null
    const playerSpeed = BASE_PLAYER_SPEED + (effectiveStats.agility * 0.2)
    const bulletSpeed = BASE_BULLET_SPEED + (effectiveStats.intelligence * 0.2)
    const maxLives = 3 + Math.floor(effectiveStats.endurance / 10)
    const scoreMultiplier = 1 + (effectiveStats.strength * 0.05)
    const enemySpeedMult = Math.max(0.3, 1 - (effectiveStats.charisma * 0.01))

    return { playerSpeed, bulletSpeed, maxLives, scoreMultiplier, enemySpeedMult }
  }, [effectiveStats])

  const loadGameAssets = async (charType: string) => {
    setGameState("loading_assets")
    try {
      const charConfig = CHARACTER_TYPES.find(c => c.value === charType) || CHARACTER_TYPES[0]
      const playerSrc = charConfig.image

      const [playerImg, enemy1, enemy2, enemy3, bgImg] = await Promise.all([
        loadImage(playerSrc),
        loadImage("/esqueleto.png"),
        loadImage("/ogro.png"),
        loadImage("/mago.png"),
        loadImage("/bg-dungeon.png")
      ])

      assetsRef.current = {
        playerImg,
        enemyImgs: [enemy1, enemy2, enemy3],
        bgImg
      }
      setGameState("menu")
    } catch (e) {
      console.error("Failed to load assets", e)
      setGameState("menu")
    }
  }

  const handleSelectCharacter = (char: Character) => {
    setSelectedCharacter(char)
    loadGameAssets(char.character_type)
  }

  const createParticles = useCallback((x: number, y: number, color = "#ffffff", count = 8) => {
    for (let i = 0; i < count; i++) {
      gameStateRef.current.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 6,
        life: 30,
        maxLife: 30,
        size: Math.random() * 3 + 1,
        color,
      })
    }
  }, [])

  const createInvaders = useCallback(() => {
    const invaders: Invader[] = []
    const startX = 140
    const startY = 80
    const spacingX = 60
    const spacingY = 50

    for (let row = 0; row < INVADER_ROWS; row++) {
      for (let col = 0; col < INVADER_COLS; col++) {
        invaders.push({
          x: startX + col * spacingX,
          y: startY + row * spacingY,
          width: INVADER_WIDTH,
          height: INVADER_HEIGHT,
          alive: true,
          type: row % 3, // Rotate through enemy images
        })
      }
    }
    return invaders
  }, [])

  const initGame = useCallback(() => {
    if (!gameModifiers) return
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = CANVAS_WIDTH
    canvas.height = CANVAS_HEIGHT

    gameStateRef.current = {
      player: {
        x: CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2,
        y: CANVAS_HEIGHT - 60,
        width: PLAYER_WIDTH,
        height: PLAYER_HEIGHT,
      },
      bullets: [],
      invaders: createInvaders(),
      particles: [],
      score: 0,
      lives: gameModifiers.maxLives,
      wave: 1,
      invaderDirection: 1,
      lastInvaderMove: 0,
      lastInvaderShot: 0,
      canvas,
      ctx: canvas.getContext("2d"),
      keys: new Set(),
    }
    setScore(0)
    setLives(gameModifiers.maxLives)
    setWave(1)
  }, [createInvaders, gameModifiers])

  const startGame = useCallback(() => {
    setGameState("playing")
    initGame()
  }, [initGame])

  const nextWave = useCallback(() => {
    gameStateRef.current.wave++
    gameStateRef.current.invaders = createInvaders()
    gameStateRef.current.bullets = []
    gameStateRef.current.invaderDirection = 1
    // Optional: give back a life on wave clear up to max
    if (gameModifiers && gameStateRef.current.lives < gameModifiers.maxLives) {
      gameStateRef.current.lives++
      setLives(gameStateRef.current.lives)
    }
    setWave(gameStateRef.current.wave)
  }, [createInvaders, gameModifiers])

  const saveStats = async (finalScore: number) => {
    if (!selectedCharacter) return
    // Simple logic: if score > 500, give 1 xp per 100 points
    const xpGained = Math.floor(finalScore / 100)
    if (xpGained > 0) {
      const supabase = createClient()
      await supabase.rpc('increment_xp', { char_id: selectedCharacter.id, xp_amount: xpGained })
    }
  }

  const endGame = useCallback(
    (won: boolean) => {
      setGameState(won ? "won" : "gameOver")
      const finalScore = gameStateRef.current.score
      if (finalScore > highScore) {
        setHighScore(finalScore)
      }
      setScore(finalScore)
      saveStats(finalScore)
    },
    [highScore, selectedCharacter]
  )

  const shoot = useCallback(() => {
    const { player, bullets } = gameStateRef.current
    if (!gameModifiers) return

    // Character Intelligence allows more bullets on screen (base 3, up to 6)
    const maxBullets = 3 + Math.floor((selectedCharacter?.intelligence || 5) / 10)
    const playerBullets = bullets.filter((b) => b.isPlayerBullet)

    if (playerBullets.length < maxBullets) {
      bullets.push({
        x: player.x + player.width / 2 - BULLET_WIDTH / 2,
        y: player.y,
        width: BULLET_WIDTH,
        height: BULLET_HEIGHT,
        speed: -gameModifiers.bulletSpeed, // Character Intelligence modifies this
        isPlayerBullet: true,
      })
    }
  }, [gameModifiers, selectedCharacter])

  const checkCollision = (rect1: any, rect2: any): boolean => {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    )
  }

  const updateGame = useCallback(() => {
    if (!gameModifiers) return
    const { player, bullets, invaders, particles, canvas, ctx, keys } = gameStateRef.current
    if (!canvas || !ctx || gameState !== "playing") return

    const currentTime = Date.now()

    // Player movement
    if (keys.has("arrowleft") || keys.has("a")) {
      player.x = Math.max(0, player.x - gameModifiers.playerSpeed)
    }
    if (keys.has("arrowright") || keys.has("d")) {
      player.x = Math.min(canvas.width - player.width, player.x + gameModifiers.playerSpeed)
    }

    // Update bullets
    for (let i = bullets.length - 1; i >= 0; i--) {
      const bullet = bullets[i]
      bullet.y += bullet.speed

      if (bullet.y < 0 || bullet.y > canvas.height) {
        bullets.splice(i, 1)
        continue
      }

      if (bullet.isPlayerBullet) {
        for (let j = 0; j < invaders.length; j++) {
          const invader = invaders[j]
          if (invader.alive && checkCollision(bullet, invader)) {
            invader.alive = false
            bullets.splice(i, 1)

            // Score with Character Strength multiplier
            const basePoints = (4 - invader.type) * 10 + gameStateRef.current.wave * 5
            const finalPoints = Math.floor(basePoints * gameModifiers.scoreMultiplier)

            gameStateRef.current.score += finalPoints
            setScore(gameStateRef.current.score)

            // Create blood/magic particles
            const pColor = invader.type === 0 ? "#e2e8f0" : invader.type === 1 ? "#16a34a" : "#9333ea"
            createParticles(invader.x + invader.width / 2, invader.y + invader.height / 2, pColor, 12)
            break
          }
        }
      } else {
        // Enemy bullet hitting player
        // Make hitbox slightly smaller for player to make it fair
        const playerHitbox = {
          x: player.x + 8,
          y: player.y + 8,
          width: player.width - 16,
          height: player.height - 16
        }
        if (checkCollision(bullet, playerHitbox)) {
          bullets.splice(i, 1)
          gameStateRef.current.lives--
          setLives(gameStateRef.current.lives)
          createParticles(player.x + player.width / 2, player.y + player.height / 2, "#ef4444", 20)
          if (gameStateRef.current.lives <= 0) {
            endGame(false)
            return
          }
        }
      }
    }

    // Move invaders with wave scale + charisma check - Made scaling gentler for wave 2+
    const baseWait = Math.max(300, 900 - (gameStateRef.current.wave - 1) * 15)
    const charWait = baseWait / gameModifiers.enemySpeedMult

    if (currentTime - gameStateRef.current.lastInvaderMove > charWait) {
      let shouldMoveDown = false
      const aliveInvaders = invaders.filter((inv) => inv.alive)

      for (const invader of aliveInvaders) {
        if (
          (gameStateRef.current.invaderDirection > 0 && invader.x + invader.width >= canvas.width - 20) ||
          (gameStateRef.current.invaderDirection < 0 && invader.x <= 20)
        ) {
          shouldMoveDown = true
          break
        }
      }

      if (shouldMoveDown) {
        gameStateRef.current.invaderDirection *= -1
        for (const invader of aliveInvaders) {
          invader.y += 15 // reduced from 20 to 15
          if (invader.y + invader.height >= player.y) {
            endGame(false)
            return
          }
        }
      } else {
        const moveDist = 12 + (gameStateRef.current.wave - 1) * 0.8 // reduced base speed and scaling
        for (const invader of aliveInvaders) {
          invader.x += moveDist * gameStateRef.current.invaderDirection
        }
      }
      gameStateRef.current.lastInvaderMove = currentTime
    }

    // Invader shooting freq depends on wave AND charisma - reduced freq
    const shootFreq = (2000 + Math.random() * 3000) / gameModifiers.enemySpeedMult
    if (currentTime - gameStateRef.current.lastInvaderShot > shootFreq) {
      const aliveInvaders = invaders.filter((inv) => inv.alive)
      if (aliveInvaders.length > 0) {
        const shooter = aliveInvaders[Math.floor(Math.random() * aliveInvaders.length)]
        bullets.push({
          x: shooter.x + shooter.width / 2 - BULLET_WIDTH / 2,
          y: shooter.y + shooter.height,
          width: BULLET_WIDTH,
          height: BULLET_HEIGHT,
          speed: BASE_BULLET_SPEED * 0.5 * gameModifiers.enemySpeedMult,
          isPlayerBullet: false,
        })
      }
      gameStateRef.current.lastInvaderShot = currentTime
    }

    const aliveInvaders = invaders.filter((inv) => inv.alive)
    if (aliveInvaders.length === 0) {
      setTimeout(() => nextWave(), 1000)
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i]
      p.x += p.vx
      p.y += p.vy
      p.vx *= 0.98
      p.vy *= 0.98
      p.life--
      if (p.life <= 0) particles.splice(i, 1)
    }

    // Drawing
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw background matching the RPG Theme
    if (assetsRef.current.bgImg) {
      // Draw zoomed bg over time? Maybe just static for now
      ctx.drawImage(assetsRef.current.bgImg, 0, 0, canvas.width, canvas.height)
      // Darken overlay
      ctx.fillStyle = "rgba(0,0,0,0.6)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    } else {
      ctx.fillStyle = "#0f172a"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    // Draw particles
    particles.forEach((p) => {
      ctx.fillStyle = p.color
      ctx.globalAlpha = p.life / p.maxLife
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fill()
    })
    ctx.globalAlpha = 1

    // Draw player
    if (assetsRef.current.playerImg) {
      ctx.drawImage(assetsRef.current.playerImg, player.x, player.y, player.width, player.height)
    } else {
      ctx.fillStyle = themeColor
      ctx.fillRect(player.x, player.y, player.width, player.height)
    }

    // Draw invaders
    invaders.forEach((invader) => {
      if (invader.alive) {
        const img = assetsRef.current.enemyImgs[invader.type]
        if (img) {
          ctx.drawImage(img, invader.x, invader.y, invader.width, invader.height)
        } else {
          ctx.fillStyle = "#ef4444"
          ctx.fillRect(invader.x, invader.y, invader.width, invader.height)
        }
      }
    })

    // Draw bullets
    bullets.forEach((bullet) => {
      if (bullet.isPlayerBullet) {
        // glowing blue/yellow bullet
        ctx.fillStyle = "#3b82f6"
        ctx.shadowColor = "#60a5fa"
        ctx.shadowBlur = 10
      } else {
        // glowing red/purple bullet
        ctx.fillStyle = "#ef4444"
        ctx.shadowColor = "#f87171"
        ctx.shadowBlur = 10
      }
      ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height)
      ctx.shadowBlur = 0 // reset
    })

    // Draw UI
    ctx.fillStyle = "#ffffff"
    ctx.font = "20px font-serif, Georgia, serif"
    ctx.textAlign = "left"
    ctx.fillText(`Pontos: ${gameStateRef.current.score}`, 20, 30)

    // Draw hearts for lives
    for (let i = 0; i < gameStateRef.current.lives; i++) {
      // simple red square as fallback, but ideally an icon
      ctx.fillStyle = "#ef4444"
      ctx.fillRect(20 + (i * 20), 45, 12, 12)
    }

    ctx.fillStyle = "#ffffff"
    ctx.fillText(`Onda ${gameStateRef.current.wave}`, 20, 85)

    gameLoopRef.current = requestAnimationFrame(updateGame)
  }, [gameState, themeColor, createParticles, endGame, nextWave, gameModifiers])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      gameStateRef.current.keys.add(e.key.toLowerCase())
      if (gameState === "playing" && e.key === " ") {
        e.preventDefault()
        shoot()
      }
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      gameStateRef.current.keys.delete(e.key.toLowerCase())
    }
    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current)
    }
  }, [gameState, shoot])

  useEffect(() => {
    if (gameState === "playing") {
      gameLoopRef.current = requestAnimationFrame(updateGame)
    } else if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current)
    }
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current)
    }
  }, [gameState, updateGame])

  useEffect(() => {
    if (gameState !== "gameOver" && gameState !== "won") return
    const handleEndKeys = (e: KeyboardEvent) => {
      if (e.key === "Enter") startGame()
      else if (e.key === "Escape") setGameState("menu")
    }
    window.addEventListener("keydown", handleEndKeys)
    return () => window.removeEventListener("keydown", handleEndKeys)
  }, [gameState, startGame])

  if (gameState === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 p-8">
        <div className="animate-pulse text-slate-400">Carregando seus heróis...</div>
      </div>
    )
  }

  if (gameState === "loading_assets") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mb-4"></div>
        <div className="text-amber-500 font-serif">Preparando a Masmorra...</div>
      </div>
    )
  }

  if (gameState === "selection") {
    return (
      <div className="flex flex-col items-center min-h-screen bg-slate-950 p-8 text-slate-100">
        <header className="mb-8 flex w-full max-w-4xl items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm">Voltar</span>
          </button>
          <h1 className="font-serif text-2xl font-bold tracking-tighter text-amber-500">
            DEFESA DA MASMORRA
          </h1>
          <div className="w-20" /> {/* Spacer */}
        </header>

        <div className="max-w-4xl w-full">
          <h2 className="text-xl font-bold mb-4 text-center">Selecione seu Campeão</h2>
          {characters.length === 0 ? (
            <div className="text-center text-slate-400 py-12">
              <p>Você precisa criar um personagem primeiro para jogar!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {characters.map(char => {
                const stats = calculateEffectiveStats(char)
                return (
                  <button
                    key={char.id}
                    onClick={() => handleSelectCharacter(char)}
                    className="bg-slate-900 border border-slate-700 hover:border-amber-500 hover:bg-slate-800 rounded-xl p-4 transition-all text-left group"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <PixelCharacterAvatar type={char.character_type} className="w-16 h-16 group-hover:scale-110 transition-transform" />
                      <div>
                        <div className="font-bold text-lg text-slate-200">{char.name}</div>
                        <div className="text-xs text-indigo-400 font-bold uppercase tracking-wider">Lvl {getLevel(char.xp)}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
                      <div className="flex items-center gap-1"><Zap className="w-3 h-3 text-yellow-500" /> Vel: {Math.floor(BASE_PLAYER_SPEED + stats.agility * 0.2)}</div>
                      <div className="flex items-center gap-1"><Brain className="w-3 h-3 text-blue-500" /> Tiro: {Math.floor(BASE_BULLET_SPEED + stats.intelligence * 0.2)}</div>
                      <div className="flex items-center gap-1"><Shield className="w-3 h-3 text-emerald-500" /> Vidas: {3 + Math.floor(stats.endurance / 10)}</div>
                      <div className="flex items-center gap-1"><Heart className="w-3 h-3 text-rose-500" /> Encant: {stats.charisma}</div>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 p-4 sm:p-8">
      <div className="relative w-full max-w-[800px]">
        <canvas
          ref={canvasRef}
          className="border border-slate-800 rounded-lg shadow-2xl shadow-indigo-500/10 w-full"
          style={{ width: "100%", height: "auto", touchAction: "none" }}
        />
        {gameState === "menu" && selectedCharacter && effectiveStats && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/90 backdrop-blur-sm rounded-lg">
            <Card className="p-8 text-center border-slate-700 shadow-xl bg-slate-900 text-slate-100 w-96">
              <div className="mb-6">
                <PixelCharacterAvatar type={selectedCharacter.character_type} className="w-24 h-24 mx-auto mb-4" />
                <h1 className="text-2xl font-serif font-bold text-amber-500 mb-2">Resista, {selectedCharacter.name}!</h1>
                <p className="text-sm text-slate-400 mb-4">A horda se aproxima rápido. Use seus atributos.</p>
                <div className="bg-slate-950 rounded-lg p-3 text-left text-xs text-slate-300 space-y-1 border border-slate-800">
                  <div className="font-medium text-amber-400 mb-2">Controles:</div>
                  <div className="flex justify-between items-center">
                    <span>Mover:</span>
                    <span><kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700">←→</kbd> ou <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700">A D</kbd></span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Atacar:</span>
                    <span><kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700">Espaço</kbd></span>
                  </div>
                </div>
              </div>
              <Button
                onClick={startGame}
                className="w-full text-white bg-amber-600 hover:bg-amber-500 px-6 py-2 text-sm font-bold tracking-widest uppercase transition-colors"
              >
                Iniciar Batalha
              </Button>
              {highScore > 0 && <p className="mt-4 text-xs font-bold text-amber-500">🏆 Recorde Pessoal: {highScore}</p>}
              <button onClick={() => setGameState("selection")} className="mt-4 text-xs text-slate-500 hover:text-slate-300 transition-colors">
                Trocar Herói
              </button>
            </Card>
          </div>
        )}
        {(gameState === "gameOver" || gameState === "won") && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/90 backdrop-blur-sm rounded-lg">
            <Card className="p-8 text-center border-slate-700 shadow-xl bg-slate-900 text-slate-100 w-96">
              <h2 className="text-lg font-serif font-bold text-slate-500 mb-1">Dungeon Defense</h2>
              <h3 className={`text-3xl font-black italic tracking-tighter mb-4 ${gameState === "won" ? "text-amber-500" : "text-red-500"}`}>
                {gameState === "won" ? "VITÓRIA!" : "DERROTA..."}
              </h3>
              <div className="space-y-3 mb-6 bg-slate-950 p-4 rounded-lg border border-slate-800">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-bold uppercase text-xs tracking-wider">Pontuação</span>
                  <span className="text-2xl font-black text-white">{score}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-xs uppercase font-bold tracking-wider">Onda Alcançada</span>
                  <span className="text-lg font-bold text-amber-500">{wave}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                  <span className="text-slate-500 text-xs">Recorde Atual</span>
                  <span className="text-sm font-bold text-slate-300">{highScore}</span>
                </div>
              </div>
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={startGame}
                  className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 font-bold transition-all"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Jogar Novamente
                </Button>
                <Button
                  onClick={() => setGameState("menu")}
                  variant="outline"
                  className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white px-8 font-bold transition-all"
                >
                  Menu
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Mobile Touch Controls */}
      {gameState === "playing" && (
        <div className="flex justify-between items-center w-full max-w-[800px] mt-6 px-4 sm:hidden">
          <div className="flex gap-4">
            <button
              className="bg-slate-800 text-slate-100 p-4 rounded-full border border-slate-700 active:bg-slate-700 shadow-lg select-none touch-manipulation"
              onTouchStart={(e) => { e.preventDefault(); gameStateRef.current.keys.add("arrowleft"); }}
              onTouchEnd={(e) => { e.preventDefault(); gameStateRef.current.keys.delete("arrowleft"); }}
              onMouseDown={() => gameStateRef.current.keys.add("arrowleft")}
              onMouseUp={() => gameStateRef.current.keys.delete("arrowleft")}
              onMouseLeave={() => gameStateRef.current.keys.delete("arrowleft")}
            >
              <ArrowLeft className="w-8 h-8" />
            </button>
            <button
              className="bg-slate-800 text-slate-100 p-4 rounded-full border border-slate-700 active:bg-slate-700 shadow-lg select-none touch-manipulation"
              onTouchStart={(e) => { e.preventDefault(); gameStateRef.current.keys.add("arrowright"); }}
              onTouchEnd={(e) => { e.preventDefault(); gameStateRef.current.keys.delete("arrowright"); }}
              onMouseDown={() => gameStateRef.current.keys.add("arrowright")}
              onMouseUp={() => gameStateRef.current.keys.delete("arrowright")}
              onMouseLeave={() => gameStateRef.current.keys.delete("arrowright")}
            >
              <ArrowRight className="w-8 h-8" />
            </button>
          </div>
          <button
            className="bg-amber-600 text-white p-4 rounded-full border border-amber-500 active:bg-amber-500 shadow-lg shadow-amber-900/50 select-none touch-manipulation"
            onTouchStart={(e) => { e.preventDefault(); gameStateRef.current.keys.add(" "); shoot(); }}
            onTouchEnd={(e) => { e.preventDefault(); gameStateRef.current.keys.delete(" "); }}
            onMouseDown={() => { gameStateRef.current.keys.add(" "); shoot(); }}
            onMouseUp={() => gameStateRef.current.keys.delete(" ")}
            onMouseLeave={() => gameStateRef.current.keys.delete(" ")}
          >
            <Zap className="w-8 h-8" />
          </button>
        </div>
      )}
    </div>
  )
}
