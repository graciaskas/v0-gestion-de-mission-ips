"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface ConstatFormProps {
  onSubmit: (data: { description: string; categorie: string }) => void
  onCancel: () => void
}

export function ConstatForm({ onSubmit, onCancel }: ConstatFormProps) {
  const [formData, setFormData] = useState({
    description: "",
    categorie: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="categorie">Catégorie *</Label>
        <Input
          id="categorie"
          value={formData.categorie}
          onChange={(e) => setFormData({ ...formData, categorie: e.target.value })}
          placeholder="Ex: Hygiène, Personne, etc."
          required
        />
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
