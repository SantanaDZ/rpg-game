"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Pencil, Check, X } from "lucide-react"
import { useRouter } from "next/navigation"

interface TeamNameEditorProps {
    initialTeamName: string | null
    userId: string
}

export function TeamNameEditor({ initialTeamName, userId }: TeamNameEditorProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [teamName, setTeamName] = useState(initialTeamName || "")
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handleSave() {
        setLoading(true)
        const supabase = createClient()

        const { error } = await supabase
            .from("profiles")
            .update({ team_name: teamName })
            .eq("id", userId)

        if (error) {
            console.error("Erro ao atualizar nome da equipe:", error)
            alert("Erro ao salvar o nome da equipe. Tente novamente.")
        } else {
            setIsEditing(false)
            router.refresh()
        }
        setLoading(false)
    }

    if (isEditing) {
        return (
            <div className="flex items-center gap-2">
                <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="Nome da sua equipe"
                    className="rounded-lg border border-border bg-input px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    autoFocus
                />
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="rounded-md bg-primary p-1.5 text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                    <Check className="h-4 w-4" />
                </button>
                <button
                    onClick={() => {
                        setIsEditing(false)
                        setTeamName(initialTeamName || "")
                    }}
                    className="rounded-md bg-muted p-1.5 text-muted-foreground hover:bg-muted/80"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        )
    }

    return (
        <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-foreground">
                {initialTeamName || "Sua Equipe"}
            </h2>
            <button
                onClick={() => setIsEditing(true)}
                className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                title="Editar nome da equipe"
            >
                <Pencil className="h-4 w-4" />
            </button>
        </div>
    )
}
