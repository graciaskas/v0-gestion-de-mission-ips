"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Document, TypeDocument, StatutDocument, Entreprise, Mission } from "@/lib/types"
import { useEntreprises } from "@/lib/data/entreprises-data"
import { useMissions } from "@/lib/data/missions-data"

interface DocumentFormProps {
  document?: Document
  onSubmit: (data: Partial<Document>) => void
  onCancel: () => void
}

const typesDocument: TypeDocument[] = [
  "Rapport d'inspection",
  "Procès-verbal",
  "Autorisation",
  "Certificat",
  "Correspondance",
  "Photo",
  "Plan de redressement",
  "Autre",
]

const statutsDocument: StatutDocument[] = ["Actif", "Archivé", "Obsolète"]

export function DocumentForm({ document, onSubmit, onCancel }: DocumentFormProps) {
  const { getEntreprises } = useEntreprises()
  const { getMissions } = useMissions()
  const [entreprises, setEntreprises] = useState<Entreprise[]>([])
  const [missions, setMissions] = useState<Mission[]>([])
  const [formData, setFormData] = useState({
    titre: document?.titre || "",
    type: document?.type || "Rapport d'inspection",
    description: document?.description || "",
    statut: document?.statut || "Actif",
    entrepriseId: document?.entrepriseId || "",
    missionId: document?.missionId || "",
    tags: document?.tags?.join(", ") || "",
    creePar: document?.creePar || "",
    notes: document?.notes || "",
    fichier: {
      nom: document?.fichier?.nom || "",
      taille: document?.fichier?.taille || 0,
      type: document?.fichier?.type || "",
      url: document?.fichier?.url || "#",
    },
  })

  useEffect(() => {
    setEntreprises(getEntreprises())
    setMissions(getMissions())
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const selectedEntreprise = entreprises.find((e) => e.id === formData.entrepriseId)
    const selectedMission = missions.find((m) => m.id === formData.missionId)

    onSubmit({
      ...formData,
      entrepriseNom: selectedEntreprise?.nom,
      missionType: selectedMission?.type,
      tags: formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({
        ...formData,
        fichier: {
          nom: file.name,
          taille: file.size,
          type: file.type,
          url: URL.createObjectURL(file),
        },
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Informations du document</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="titre">Titre du document *</Label>
            <Input
              id="titre"
              value={formData.titre}
              onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="type">Type de document *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value as TypeDocument })}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  {typesDocument.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="statut">Statut *</Label>
              <Select
                value={formData.statut}
                onValueChange={(value) => setFormData({ ...formData, statut: value as StatutDocument })}
              >
                <SelectTrigger id="statut">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statutsDocument.map((statut) => (
                    <SelectItem key={statut} value={statut}>
                      {statut}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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

          <div className="space-y-2">
            <Label htmlFor="fichier">Fichier {!document && "*"}</Label>
            <Input id="fichier" type="file" onChange={handleFileChange} required={!document} />
            {formData.fichier.nom && (
              <p className="text-sm text-muted-foreground">
                Fichier actuel: {formData.fichier.nom} ({(formData.fichier.taille / 1024).toFixed(2)} KB)
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Associations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="entreprise">Entreprise associée</Label>
              <Select
                value={formData.entrepriseId}
                onValueChange={(value) => setFormData({ ...formData, entrepriseId: value })}
              >
                <SelectTrigger id="entreprise">
                  <SelectValue placeholder="Aucune" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucune</SelectItem>
                  {entreprises.map((entreprise) => (
                    <SelectItem key={entreprise.id} value={entreprise.id}>
                      {entreprise.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mission">Mission associée</Label>
              <Select
                value={formData.missionId}
                onValueChange={(value) => setFormData({ ...formData, missionId: value })}
              >
                <SelectTrigger id="mission">
                  <SelectValue placeholder="Aucune" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucune</SelectItem>
                  {missions.map((mission) => (
                    <SelectItem key={mission.id} value={mission.id}>
                      {mission.type} - {mission.entrepriseNom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (séparés par des virgules)</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="Ex: inspection, hygiène, 2024"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="creePar">Créé par *</Label>
            <Input
              id="creePar"
              value={formData.creePar}
              onChange={(e) => setFormData({ ...formData, creePar: e.target.value })}
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
        <Button type="submit">{document ? "Mettre à jour" : "Enregistrer"}</Button>
      </div>
    </form>
  )
}
