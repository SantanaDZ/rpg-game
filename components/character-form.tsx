"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { PixelCharacterAvatar } from "@/components/pixel-character-avatar"
import { AttributeSlider } from "@/components/attribute-slider"
import { ColorPicker } from "@/components/color-picker"
import { Swords, Brain, Zap, Shield, Heart, Save, ArrowLeft } from "lucide-react"
import Link from "next/link"

const EYE_PRESETS = ["#4a3728", "#2e6b30", "#3b6ea5", "#6b4c8a", "#1a1a1a", "#a0785a"]
import {
  CHARACTER_TYPES,
  DEFENSE_POWERS,
  ATTACK_POWERS,
  calculateEffectiveStats,
  getLevel,
  getMaxPoints,
  isMaxLevel,
  MAX_LEVEL
} from "@/lib/game-constants"

interface CharacterData {
  id?: string
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
  armor_type?: string
  weapon_type?: string
  character_type?: string
  xp?: number
}

interface CharacterFormProps {
  initialData?: CharacterData
  mode: "create" | "edit"
}

export function CharacterForm({ initialData, mode }: CharacterFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState(initialData?.name ?? "")
  const [characterType, setCharacterType] = useState(initialData?.character_type ?? "knight")

  // Use default class stats instead of flat 5s
  const initialClass = CHARACTER_TYPES.find(t => t.value === (initialData?.character_type ?? "knight")) || CHARACTER_TYPES[0]
  const [strength, setStrength] = useState(initialData?.strength ?? initialClass.baseStats.strength)
  const [intelligence, setIntelligence] = useState(initialData?.intelligence ?? initialClass.baseStats.intelligence)
  const [agility, setAgility] = useState(initialData?.agility ?? initialClass.baseStats.agility)
  const [endurance, setEndurance] = useState(initialData?.endurance ?? initialClass.baseStats.endurance)
  const [charisma, setCharisma] = useState(initialData?.charisma ?? initialClass.baseStats.charisma)

  const [skinColor, setSkinColor] = useState(initialData?.skin_color ?? "#c8a27a")
  const [hairColor, setHairColor] = useState(initialData?.hair_color ?? "#2c1b0e")
  const [hairStyle, setHairStyle] = useState(initialData?.hair_style ?? "curto")
  const [eyeColor, setEyeColor] = useState(initialData?.eye_color ?? "#4a3728")
  const [armorType, setArmorType] = useState(initialData?.armor_type ?? "none")
  const [weaponType, setWeaponType] = useState(initialData?.weapon_type ?? "none")
  const [xp, setXp] = useState(initialData?.xp ?? 0)

  const level = getLevel(xp)
  const atMaxLevel = isMaxLevel(xp)
  const maxAllowedPoints = getMaxPoints(level)
  const PLAYABLE_TYPES = CHARACTER_TYPES.filter(t => t.isPlayable)
  const currentClass = CHARACTER_TYPES.find(t => t.value === characterType) || PLAYABLE_TYPES[0]

  const effectiveStats = calculateEffectiveStats({
    strength, intelligence, agility, endurance, charisma,
    armor_type: armorType,
    weapon_type: weaponType
  })

  const attributeSum = strength + intelligence + agility + endurance + charisma
  const totalPoints = effectiveStats.hp
  const pointsRemaining = maxAllowedPoints - attributeSum

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError("O nome do personagem e obrigatorio.")
      return
    }

    if (attributeSum > maxAllowedPoints) {
      setError(`Voce excedeu o limite de pontos (${attributeSum}/${maxAllowedPoints}).`)
      return
    }

    setSaving(true)
    try {
      const supabase = createClient()

      const {
        data: { user },
        error: authError
      } = await supabase.auth.getUser()

      if (authError) throw authError
      if (!user) throw new Error("Voce precisa estar logado para salvar personagens.")

      const characterData = {
        user_id: user.id,
        name: name.trim(),
        strength,
        intelligence,
        agility,
        endurance,
        charisma,
        skin_color: skinColor,
        hair_color: hairColor,
        eye_color: eyeColor,
        armor_type: armorType,
        weapon_type: weaponType,
        character_type: characterType,
        xp: xp
      }

      if (mode === "create") {
        const { error: insertError } = await supabase
          .from("characters")
          .insert(characterData)

        if (insertError) throw insertError
      } else {
        const { error: updateError } = await supabase
          .from("characters")
          .update(characterData)
          .eq("id", initialData?.id)

        if (updateError) throw updateError
      }

      router.push("/protected")
      router.refresh()
    } catch (err: any) {
      console.error("Erro ao salvar:", err)
      setError(err.message || err.details || "Ocorreu um erro inesperado ao salvar.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 w-full max-w-5xl mx-auto">
      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Avatar preview */}
        <div className="flex flex-col items-center gap-4 lg:sticky lg:top-8 lg:self-start">
          <div className="w-full rounded-xl border border-border bg-card p-6 flex flex-col items-center gap-4">
            <h3 className="font-serif text-lg font-semibold text-card-foreground">Preview</h3>
            <PixelCharacterAvatar
              skinColor={skinColor}
              type={characterType}
              className="w-48 h-auto"
            />
            <p className="text-sm font-medium text-primary truncate max-w-full">
              {name || "Sem nome"}
            </p>
            <div className="w-full border-t border-border pt-3 flex flex-col gap-1">
              <p className="text-xs text-muted-foreground text-center">
                {atMaxLevel ? (
                  <span className="font-bold text-amber-400">✦ NÍVEL MÁXIMO ({MAX_LEVEL}) ATINGIDO!</span>
                ) : (
                  <>Pontos (Nível {level}): <span className={`font-bold ${attributeSum > maxAllowedPoints ? 'text-destructive' : 'text-foreground'}`}>{attributeSum}</span> / {maxAllowedPoints}</>
                )}
              </p>
              <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-1 border-t border-border pt-2">
                <div className="flex justify-between text-[10px]"><span className="text-muted-foreground uppercase">Força:</span> <span className="font-bold">{effectiveStats.strength}</span></div>
                <div className="flex justify-between text-[10px]"><span className="text-muted-foreground uppercase">Intel:</span> <span className="font-bold">{effectiveStats.intelligence}</span></div>
                <div className="flex justify-between text-[10px]"><span className="text-muted-foreground uppercase">Agil:</span> <span className="font-bold">{effectiveStats.agility}</span></div>
                <div className="flex justify-between text-[10px]"><span className="text-muted-foreground uppercase">Resist:</span> <span className="font-bold">{effectiveStats.endurance}</span></div>
                <div className="flex justify-between text-[10px]"><span className="text-muted-foreground uppercase">Caris:</span> <span className="font-bold">{effectiveStats.charisma}</span></div>
                <div className="flex justify-between text-[10px] font-bold text-primary"><span className="uppercase">HP:</span> <span>{effectiveStats.hp}</span></div>
              </div>
              {pointsRemaining < 0 && (
                <p className="text-[10px] text-destructive font-bold text-center animate-pulse mt-1">
                  Excedeu {Math.abs(pointsRemaining)} pontos!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Middle column - Attributes */}
        <div className="flex flex-col gap-6">
          <div className="rounded-xl border border-border bg-card p-6 flex flex-col gap-5">
            <h3 className="font-serif text-lg font-semibold text-card-foreground">Nome</h3>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome do personagem"
              maxLength={50}
              required
              className="rounded-lg border border-border bg-input px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="rounded-xl border border-border bg-card p-6 flex flex-col gap-5">
            <h3 className="font-serif text-lg font-semibold text-card-foreground">Atributos</h3>
            <AttributeSlider
              label="Força"
              value={strength}
              onChange={setStrength}
              max={currentClass.maxStats.strength}
              icon={<Swords className="h-4 w-4 text-primary" />}
            />
            <AttributeSlider
              label="Inteligência"
              value={intelligence}
              onChange={setIntelligence}
              max={currentClass.maxStats.intelligence}
              icon={<Brain className="h-4 w-4 text-primary" />}
            />
            <AttributeSlider
              label="Agilidade"
              value={agility}
              onChange={setAgility}
              max={currentClass.maxStats.agility}
              icon={<Zap className="h-4 w-4 text-primary" />}
            />
            <AttributeSlider
              label="Resistência"
              value={endurance}
              onChange={setEndurance}
              max={currentClass.maxStats.endurance}
              icon={<Shield className="h-4 w-4 text-primary" />}
            />
            <AttributeSlider
              label="Carisma"
              value={charisma}
              onChange={setCharisma}
              max={currentClass.maxStats.charisma}
              icon={<Heart className="h-4 w-4 text-primary" />}
            />
          </div>
        </div>

        {/* Right column - Appearance */}
        <div className="flex flex-col gap-6">
          <div className="rounded-xl border border-border bg-card p-6 flex flex-col gap-5">
            <h3 className="font-serif text-lg font-semibold text-card-foreground">Habilidades de Classe</h3>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">Escolher Classe</label>
              <div className="grid grid-cols-2 gap-2">
                {PLAYABLE_TYPES.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => {
                      setCharacterType(type.value)
                      setStrength(type.baseStats.strength)
                      setIntelligence(type.baseStats.intelligence)
                      setAgility(type.baseStats.agility)
                      setEndurance(type.baseStats.endurance)
                      setCharisma(type.baseStats.charisma)
                    }}
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors border ${characterType === type.value
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-secondary text-secondary-foreground border-border hover:bg-accent"
                      }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-2 border-t border-border">
              <label className="text-sm font-medium text-foreground text-amber-500 uppercase tracking-wider">Poder de Defesa</label>
              <div className="grid grid-cols-2 gap-2">
                {DEFENSE_POWERS.map((type: any) => {
                  const mods = [
                    type.hp !== 0 && `HP:${type.hp > 0 ? '+' : ''}${type.hp}`,
                    type.str !== 0 && `FOR:${type.str > 0 ? '+' : ''}${type.str}`,
                    type.int !== 0 && `INT:${type.int > 0 ? '+' : ''}${type.int}`,
                    type.agi !== 0 && `AGI:${type.agi > 0 ? '+' : ''}${type.agi}`,
                    type.end !== 0 && `RES:${type.end > 0 ? '+' : ''}${type.end}`,
                    type.cha !== 0 && `CAR:${type.cha > 0 ? '+' : ''}${type.cha}`,
                  ].filter(Boolean).join(', ')

                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setArmorType(type.value)}
                      className={`rounded-lg px-3 py-2 text-sm font-medium border transition-all ${armorType === type.value
                        ? "bg-amber-600 border-amber-500 text-white shadow-md"
                        : "bg-secondary border-border text-secondary-foreground hover:border-amber-500/50"
                        }`}
                    >
                      <div className="flex flex-col items-center">
                        <span className="font-bold">{type.label}</span>
                        {mods && (
                          <span className={`text-[10px] ${armorType === type.value ? 'text-white/80' : 'text-muted-foreground'}`}>
                            {mods}
                          </span>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2 border-t border-border">
              <label className="text-sm font-medium text-foreground text-blue-500 uppercase tracking-wider">Poder de Ataque</label>
              <div className="grid grid-cols-2 gap-2">
                {ATTACK_POWERS.map((type: any) => {
                  const mods = [
                    type.str !== 0 && `FOR:${type.str > 0 ? '+' : ''}${type.str}`,
                    type.int !== 0 && `INT:${type.int > 0 ? '+' : ''}${type.int}`,
                    type.agi !== 0 && `AGI:${type.agi > 0 ? '+' : ''}${type.agi}`,
                    type.end !== 0 && `RES:${type.end > 0 ? '+' : ''}${type.end}`,
                    type.cha !== 0 && `CAR:${type.cha > 0 ? '+' : ''}${type.cha}`,
                  ].filter(Boolean).join(', ')

                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setWeaponType(type.value)}
                      className={`rounded-lg px-3 py-2 text-sm font-medium border transition-all ${weaponType === type.value
                        ? "bg-blue-600 border-blue-500 text-white shadow-md"
                        : "bg-secondary border-border text-secondary-foreground hover:border-blue-500/50"
                        }`}
                    >
                      <div className="flex flex-col items-center">
                        <span className="font-bold">{type.label}</span>
                        {mods && (
                          <span className={`text-[10px] ${weaponType === type.value ? 'text-white/80' : 'text-muted-foreground'}`}>
                            {mods}
                          </span>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-between border-t border-border pt-6">
        <Link
          href="/protected"
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary px-5 py-2.5 text-sm font-medium text-secondary-foreground transition-colors hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Link>
        <button
          type="submit"
          disabled={saving || attributeSum > maxAllowedPoints}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="h-4 w-4" />
          {saving ? "Salvando..." : mode === "create" ? "Criar Personagem" : "Salvar Alteracoes"}
        </button>
      </div>
    </form>
  )
}
