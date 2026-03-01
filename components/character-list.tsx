"use client"

import { CharacterCard } from "@/components/character-card"
import Link from "next/link"
import { Plus, Scroll } from "lucide-react"

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

interface CharacterListProps {
  characters: Character[]
}

export function CharacterList({ characters }: CharacterListProps) {
  if (characters.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
          <Scroll className="h-8 w-8 text-primary" />
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="font-serif text-lg font-semibold text-foreground">
            Nenhum personagem ainda
          </h3>
          <p className="text-sm text-muted-foreground">
            Crie seu primeiro personagem para comecar a aventura.
          </p>
        </div>
        <Link
          href="/personagem/novo"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Criar Personagem
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {characters.map((character) => (
        <CharacterCard key={character.id} character={character} />
      ))}
    </div>
  )
}
