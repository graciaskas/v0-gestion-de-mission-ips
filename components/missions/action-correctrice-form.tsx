"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ActionCorrectriceFormProps {
  onSubmit: (data: {
    deficienceConstatee: string
    actionCorrectrice: string
    echeance: string
    responsableSuivi: string
    observations: string
    statut: "En attente" | "En cours" | "Terminée"
  }) => void
  onCancel: () => void
}

export function ActionCorrectrice({ onSubmit, onCancel }: ActionCorrectriceFormProps) {
  const [formData, setFormData] = useState({
    deficienceConstatee: "",
    actionCorrectrice: "",
    echeance: "",
    responsableSuivi: "",
    observations: "",
    statut: "En attente" as "En attente" | "En cours" | "Terminée",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="deficienceConstatee">Déficience constatée *</Label>
        <Textarea
          id="deficienceConstatee"
          value={formData.deficienceConstatee}
          onChange={(e) => setFormData({ ...formData, deficienceConstatee: e.target.value })}
          rows={2}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="actionCorrectrice">Action correctrice *</Label>
        <Textarea
          id="actionCorrectrice"
          value={formData.actionCorrectrice}
          onChange={(e) => setFormData({ ...formData, actionCorrectrice: e.target.value })}
          rows={2}
          required
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="echeance">Échéance *</Label>
          <Input
            id="echeance"
            type="date"
            value={formData.echeance}
            onChange={(e) => setFormData({ ...formData, echeance: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="responsableSuivi">Responsable de suivi *</Label>
          <Input
            id="responsableSuivi"
            value={formData.responsableSuivi}
            onChange={(e) => setFormData({ ...formData, responsableSuivi: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="statut">Statut *</Label>
        <Select
          value={formData.statut}
          onValueChange={(value) =>
            setFormData({ ...formData, statut: value as "En attente" | "En cours" | "Terminée" })
          }
        >
          <SelectTrigger id="statut">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="En attente">En attente</SelectItem>
            <SelectItem value="En cours">En cours</SelectItem>
            <SelectItem value="Terminée">Terminée</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="observations">Observations</Label>
        <Textarea
          id="observations"
          value={formData.observations}
          onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
          rows={2}
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
