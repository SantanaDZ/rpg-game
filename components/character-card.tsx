"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { PixelCharacterAvatar } from "@/components/pixel-character-avatar"
import { Pencil, Trash2, Swords, Brain, Zap, Shield, Heart, Star } from "lucide-react"
import { calculateEffectiveStats, getLevel, CHARACTER_TYPES, getMaxPoints, DEFENSE_POWERS, ATTACK_POWERS } from "@/lib/game-constants"

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

interface CharacterCardProps {
  character: Character
}

function StatBar({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground">{icon}</span>
      <span className="text-xs text-muted-foreground w-8 truncate">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${(value / 40) * 100}%` }}
        />
      </div>
      <span className="text-xs font-bold text-foreground tabular-nums w-4 text-right">{value}</span>
    </div>
  )
}

export function CharacterCard({ character }: CharacterCardProps) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const effectiveStats = calculateEffectiveStats(character)
  const level = getLevel(character.xp)
  const nextLevelXp = level * 100
  const xpProgress = (character.xp % 100)

  async function handleDelete() {
    setDeleting(true)
    const supabase = createClient()
    await supabase.from("characters").delete().eq("id", character.id)
    router.refresh()
  }

  const currentClass = CHARACTER_TYPES.find(t => t.value === character.character_type) || CHARACTER_TYPES[0]
  const maxAllowedPoints = getMaxPoints(level)
  const spentPoints = character.strength + character.intelligence + character.agility + character.endurance + character.charisma
  const hasUpgrades = spentPoints < maxAllowedPoints

  return (
    <div className="group relative rounded-xl border border-border bg-card p-5 flex flex-col gap-4 transition-colors hover:border-primary/30">
      {hasUpgrades && (
        <div className="absolute -top-2 -right-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-white shadow-lg animate-bounce">
          <Star className="h-3.5 w-3.5 fill-current" />
        </div>
      )}
      <div className="flex items-start gap-4">
        <PixelCharacterAvatar
          type={character.character_type}
          className="w-32 h-32 shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-serif text-base font-bold text-card-foreground truncate">
            {character.name}
          </h3>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="inline-flex items-center rounded bg-indigo-500/10 px-2 py-0.5 text-[10px] font-bold text-indigo-400 border border-indigo-500/20">
              Nível {level}
            </span>
            <span className="text-[10px] font-bold text-primary">
              {effectiveStats.hp} HP Total
            </span>
            {character.wins > 0 && (
              <span className="inline-flex items-center rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200">
                {character.wins} Vitórias
              </span>
            )}
          </div>

          <div className="mt-3 flex flex-col gap-1">
            <div className="flex justify-between text-[10px] text-muted-foreground uppercase">
              <span>Experiência</span>
              <span>{character.xp} XP</span>
            </div>
            <div className="h-1 rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full bg-indigo-500"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-1 mt-2">
            {character.armor_type !== 'none' && (
              <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-500 border border-amber-500/20">
                {DEFENSE_POWERS.find(p => p.value === character.armor_type)?.label || character.armor_type}
              </span>
            )}
            {character.weapon_type !== 'none' && (
              <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-medium text-blue-500 border border-blue-500/20">
                {ATTACK_POWERS.find(p => p.value === character.weapon_type)?.label || character.weapon_type}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <StatBar icon={<Swords className="h-3 w-3" />} label="FOR" value={effectiveStats.strength} />
        <StatBar icon={<Brain className="h-3 w-3" />} label="INT" value={effectiveStats.intelligence} />
        <StatBar icon={<Zap className="h-3 w-3" />} label="AGI" value={effectiveStats.agility} />
        <StatBar icon={<Shield className="h-3 w-3" />} label="RES" value={effectiveStats.endurance} />
        <StatBar icon={<Heart className="h-3 w-3" />} label="CAR" value={effectiveStats.charisma} />
      </div>

      <div className="flex items-center gap-2 pt-2 border-t border-border">
        <Link
          href={`/personagem/${character.id}`}
          className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold shadow-sm transition-all ${hasUpgrades
            ? "bg-green-600 text-white hover:bg-green-500 scale-[1.02] shadow-green-900/20"
            : "bg-secondary text-secondary-foreground hover:bg-accent"
            }`}
        >
          {hasUpgrades ? (
            <>
              <Star className="h-3.5 w-3.5 fill-current" />
              MELHORAR
            </>
          ) : (
            <>
              <Pencil className="h-3 w-3" />
              Editar
            </>
          )}
        </Link>
        {showConfirm ? (
          <div className="flex items-center gap-1">
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="rounded-lg bg-destructive px-3 py-2 text-xs font-medium text-destructive-foreground transition-colors hover:bg-destructive/90 disabled:opacity-50"
            >
              {deleting ? "..." : "Sim"}
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="rounded-lg bg-secondary px-3 py-2 text-xs font-medium text-secondary-foreground transition-colors hover:bg-accent"
            >
              Nao
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowConfirm(true)}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-secondary px-3 py-2 text-xs font-medium text-secondary-foreground transition-colors hover:bg-destructive/20 hover:text-destructive"
          >
            <Trash2 className="h-3 w-3" />
            Excluir
          </button>
        )}
      </div>
    </div>
  )
}
