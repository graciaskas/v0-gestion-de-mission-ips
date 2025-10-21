"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Mission, TypeMission, BureauMission, StatutMission, Entreprise } from "@/lib/types"
import { useEntreprises } from "@/lib/data/entreprises-data"

interface MissionFormProps {
  mission?: Mission
  onSubmit: (data: Partial<Mission>) => void
  onCancel: () => void
}

const typesMission: TypeMission[] = ["Inspection contrôle", "Encadrement", "Audit", "Enquête"]

const bureauxMission: BureauMission[] = [
  "Médicaux techniques",
  "Hygiène",
  "Personne",
  "Ressources",
  "Pharmacie",
  "Plantes médicinales",
  "Enseignement",
]

const statutsMission: StatutMission[] = ["Planifiée", "En cours", "Terminée", "Annulée"]

export function MissionForm({ mission, onSubmit, onCancel }: MissionFormProps) {
  const { getEntreprises } = useEntreprises()
  const [entreprises, setEntreprises] = useState<Entreprise[]>([])
  const [formData, setFormData] = useState({
    type: mission?.type || ("" as TypeMission),
    bureau: mission?.bureau || ("" as BureauMission),
    entrepriseId: mission?.entrepriseId || "",
    butMission: mission?.butMission || "",
    dateDebut: mission?.dateDebut || "",
    dateFin: mission?.dateFin || "",
    statut: mission?.statut || ("Planifiée" as StatutMission),
    inspecteurs: mission?.inspecteurs?.join(", ") || "",
    notes: mission?.notes || "",
  })

  useEffect(() => {
    setEntreprises(getEntreprises())
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const selectedEntreprise = entreprises.find((e) => e.id === formData.entrepriseId)
    onSubmit({
      ...formData,
      entrepriseNom: selectedEntreprise?.nom || "",
      inspecteurs: formData.inspecteurs
        .split(",")
        .map((i) => i.trim())
        .filter(Boolean),
      constatsIrregularites: mission?.constatsIrregularites || [],
      faitsInfractionnels: mission?.faitsInfractionnels || [],
      actionsCorrectrices: mission?.actionsCorrectrices || [],
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Informations générales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="type">Type de mission *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value as TypeMission })}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  {typesMission.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bureau">Bureau *</Label>
              <Select
                value={formData.bureau}
                onValueChange={(value) => setFormData({ ...formData, bureau: value as BureauMission })}
              >
                <SelectTrigger id="bureau">
                  <SelectValue placeholder="Sélectionner un bureau" />
                </SelectTrigger>
                <SelectContent>
                  {bureauxMission.map((bureau) => (
                    <SelectItem key={bureau} value={bureau}>
                      {bureau}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="entreprise">Entreprise inspectée *</Label>
              <Select
                value={formData.entrepriseId}
                onValueChange={(value) => setFormData({ ...formData, entrepriseId: value })}
              >
                <SelectTrigger id="entreprise">
                  <SelectValue placeholder="Sélectionner une entreprise" />
                </SelectTrigger>
                <SelectContent>
                  {entreprises.map((entreprise) => (
                    <SelectItem key={entreprise.id} value={entreprise.id}>
                      {entreprise.nom} - {entreprise.type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="statut">Statut *</Label>
              <Select
                value={formData.statut}
                onValueChange={(value) => setFormData({ ...formData, statut: value as StatutMission })}
              >
                <SelectTrigger id="statut">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statutsMission.map((statut) => (
                    <SelectItem key={statut} value={statut}>
                      {statut}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateDebut">Date de début *</Label>
              <Input
                id="dateDebut"
                type="date"
                value={formData.dateDebut}
                onChange={(e) => setFormData({ ...formData, dateDebut: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateFin">Date de fin</Label>
              <Input
                id="dateFin"
                type="date"
                value={formData.dateFin}
                onChange={(e) => setFormData({ ...formData, dateFin: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="inspecteurs">Inspecteurs (séparés par des virgules) *</Label>
            <Input
              id="inspecteurs"
              value={formData.inspecteurs}
              onChange={(e) => setFormData({ ...formData, inspecteurs: e.target.value })}
              placeholder="Ex: Dr. Marie Kalala, Insp. Jean Mbala"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="butMission">But de la mission *</Label>
            <Textarea
              id="butMission"
              value={formData.butMission}
              onChange={(e) => setFormData({ ...formData, butMission: e.target.value })}
              rows={3}
              required
            />
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
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">{mission ? "Mettre à jour" : "Créer la mission"}</Button>
      </div>
    </form>
  )
}
