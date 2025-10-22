"use client"

import { useState, useEffect } from "react"
import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EntrepriseTable } from "@/components/entreprises/entreprise-table"
import { EntrepriseForm } from "@/components/entreprises/entreprise-form"
import { EntrepriseDetails } from "@/components/entreprises/entreprise-details"
import { useEntreprises } from "@/lib/data/entreprises-data"
import type { Entreprise } from "@/lib/types"

export default function EntreprisesPage() {
  const { getEntreprises, addEntreprise, updateEntreprise, deleteEntreprise } = useEntreprises()
  const [entreprises, setEntreprises] = useState<Entreprise[]>([])
  const [filteredEntreprises, setFilteredEntreprises] = useState<Entreprise[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedEntreprise, setSelectedEntreprise] = useState<Entreprise | null>(null)

  useEffect(() => {
    loadEntreprises()
  }, [])

  useEffect(() => {
    filterEntreprises()
  }, [entreprises, searchTerm, typeFilter])

  const loadEntreprises = () => {
    setEntreprises(getEntreprises())
  }

  const filterEntreprises = () => {
    let filtered = entreprises

    if (searchTerm) {
      filtered = filtered.filter(
        (e) =>
          e.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          e.ville.toLowerCase().includes(searchTerm.toLowerCase()) ||
          e.responsable.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((e) => e.type === typeFilter)
    }

    setFilteredEntreprises(filtered)
  }

  const handleAdd = (data: Partial<Entreprise>) => {
    addEntreprise(data as Omit<Entreprise, "id" | "dateCreation">)
    loadEntreprises()
    setIsAddDialogOpen(false)
  }

  const handleEdit = (data: Partial<Entreprise>) => {
    if (selectedEntreprise) {
      updateEntreprise(selectedEntreprise.id, data)
      loadEntreprises()
      setIsEditDialogOpen(false)
      setSelectedEntreprise(null)
    }
  }

  const handleDelete = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette entreprise ?")) {
      deleteEntreprise(id)
      loadEntreprises()
    }
  }

  const handleView = (entreprise: Entreprise) => {
    setSelectedEntreprise(entreprise)
    setIsViewDialogOpen(true)
  }

  const handleEditClick = (entreprise: Entreprise) => {
    setSelectedEntreprise(entreprise)
    setIsEditDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Registre des entreprises</h1>
          <p className="text-muted-foreground mt-2">Gestion des établissements inspectés</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle entreprise
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom, ville ou responsable..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Type d'établissement" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            <SelectItem value="Hotel">Hôtel</SelectItem>
            <SelectItem value="Hopital">Hôpital</SelectItem>
            <SelectItem value="Pharmacie">Pharmacie</SelectItem>
            <SelectItem value="Centre de santé">Centre de santé</SelectItem>
            <SelectItem value="Clinique">Clinique</SelectItem>
            <SelectItem value="Laboratoire">Laboratoire</SelectItem>
            <SelectItem value="Cabinet médical">Cabinet médical</SelectItem>
            <SelectItem value="Autre">Autre</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <EntrepriseTable
        entreprises={filteredEntreprises}
        onEdit={handleEditClick}
        onDelete={handleDelete}
        onView={handleView}
      />

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nouvelle entreprise</DialogTitle>
          </DialogHeader>
          <EntrepriseForm onSubmit={handleAdd} onCancel={() => setIsAddDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier l'entreprise</DialogTitle>
          </DialogHeader>
          {selectedEntreprise && (
            <EntrepriseForm
              entreprise={selectedEntreprise}
              onSubmit={handleEdit}
              onCancel={() => {
                setIsEditDialogOpen(false)
                setSelectedEntreprise(null)
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails de l'entreprise</DialogTitle>
          </DialogHeader>
          {selectedEntreprise && <EntrepriseDetails entreprise={selectedEntreprise} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}
