"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface InfractionFormProps {
  onSubmit: (data: { description: string; gravite: "Faible" | "Moyenne" | "Élevée" }) => void
  onCancel: () => void
}

export function InfractionForm({ onSubmit, onCancel }: InfractionFormProps) {
  const [formData, setFormData] = useState({
    description: "",
    gravite: "Moyenne" as "Faible" | "Moyenne" | "Élevée",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="gravite">Gravité *</Label>
        <Select
          value={formData.gravite}
          onValueChange={(value) => setFormData({ ...formData, gravite: value as "Faible" | "Moyenne" | "Élevée" })}
        >
          <SelectTrigger id="gravite">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Faible">Faible</SelectItem>
            <SelectItem value="Moyenne">Moyenne</SelectItem>
            <SelectItem value="Élevée">Élevée</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          required
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">Ajouter</Button>
      </div>
    </form>
  )
}
