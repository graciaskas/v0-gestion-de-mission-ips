"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { Entreprise, TypeEntreprise, StatutEntreprise } from "@/lib/types"

interface EntrepriseFormProps {
  entreprise?: Entreprise
  onSubmit: (data: Partial<Entreprise>) => void
  onCancel: () => void
}

const typesEntreprise: TypeEntreprise[] = [
  "Hotel",
  "Hopital",
  "Pharmacie",
  "Centre de santé",
  "Clinique",
  "Laboratoire",
  "Cabinet médical",
  "Autre",
]

const statutsEntreprise: StatutEntreprise[] = ["Active", "Inactive", "Suspendue"]

export function EntrepriseForm({ entreprise, onSubmit, onCancel }: EntrepriseFormProps) {
  const [formData, setFormData] = useState({
    nom: entreprise?.nom || "",
    type: entreprise?.type || ("" as TypeEntreprise),
    adresse: entreprise?.adresse || "",
    ville: entreprise?.ville || "",
    province: entreprise?.province || "",
    telephone: entreprise?.telephone || "",
    email: entreprise?.email || "",
    numeroAutorisation: entreprise?.numeroAutorisation || "",
    dateAutorisation: entreprise?.dateAutorisation || "",
    statut: entreprise?.statut || ("Active" as StatutEntreprise),
    responsable: entreprise?.responsable || "",
    nombreEmployes: entreprise?.nombreEmployes || 0,
    notes: entreprise?.notes || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="nom">Nom de l'établissement *</Label>
          <Input
            id="nom"
            value={formData.nom}
            onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Type d'établissement *</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => setFormData({ ...formData, type: value as TypeEntreprise })}
          >
            <SelectTrigger id="type">
              <SelectValue placeholder="Sélectionner un type" />
            </SelectTrigger>
            <SelectContent>
              {typesEntreprise.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="adresse">Adresse *</Label>
          <Input
            id="adresse"
            value={formData.adresse}
            onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ville">Ville *</Label>
          <Input
            id="ville"
            value={formData.ville}
            onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="province">Province *</Label>
          <Input
            id="province"
            value={formData.province}
            onChange={(e) => setFormData({ ...formData, province: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="telephone">Téléphone *</Label>
          <Input
            id="telephone"
            type="tel"
            value={formData.telephone}
            onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="numeroAutorisation">Numéro d'autorisation *</Label>
          <Input
            id="numeroAutorisation"
            value={formData.numeroAutorisation}
            onChange={(e) => setFormData({ ...formData, numeroAutorisation: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dateAutorisation">Date d'autorisation *</Label>
          <Input
            id="dateAutorisation"
            type="date"
            value={formData.dateAutorisation}
            onChange={(e) => setFormData({ ...formData, dateAutorisation: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="statut">Statut *</Label>
          <Select
            value={formData.statut}
            onValueChange={(value) => setFormData({ ...formData, statut: value as StatutEntreprise })}
          >
            <SelectTrigger id="statut">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statutsEntreprise.map((statut) => (
                <SelectItem key={statut} value={statut}>
                  {statut}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="responsable">Responsable *</Label>
          <Input
            id="responsable"
            value={formData.responsable}
            onChange={(e) => setFormData({ ...formData, responsable: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="nombreEmployes">Nombre d'employés</Label>
          <Input
            id="nombreEmployes"
            type="number"
            value={formData.nombreEmployes}
            onChange={(e) => setFormData({ ...formData, nombreEmployes: Number.parseInt(e.target.value) || 0 })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">{entreprise ? "Mettre à jour" : "Enregistrer"}</Button>
      </div>
    </form>
  )
}
