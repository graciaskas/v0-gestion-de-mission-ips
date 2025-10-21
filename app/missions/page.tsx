"use client"

import { useState, useEffect } from "react"
import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MissionTable } from "@/components/missions/mission-table"
import { MissionForm } from "@/components/missions/mission-form"
import { MissionDetails } from "@/components/missions/mission-details"
import { useMissions } from "@/lib/data/missions-data"
import type { Mission } from "@/lib/types"

export default function MissionsPage() {
  const { getMissions, addMission, updateMission, deleteMission } = useMissions()
  const [missions, setMissions] = useState<Mission[]>([])
  const [filteredMissions, setFilteredMissions] = useState<Mission[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statutFilter, setStatutFilter] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null)

  useEffect(() => {
    loadMissions()
  }, [])

  useEffect(() => {
    filterMissions()
  }, [missions, searchTerm, statutFilter])

  const loadMissions = () => {
    setMissions(getMissions())
  }

  const filterMissions = () => {
    let filtered = missions

    if (searchTerm) {
      filtered = filtered.filter(
        (m) =>
          m.entrepriseNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          m.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          m.bureau.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statutFilter !== "all") {
      filtered = filtered.filter((m) => m.statut === statutFilter)
    }

    setFilteredMissions(filtered)
  }

  const handleAdd = (data: Partial<Mission>) => {
    addMission(data as Omit<Mission, "id" | "dateCreation">)
    loadMissions()
    setIsAddDialogOpen(false)
  }

  const handleEdit = (data: Partial<Mission>) => {
    if (selectedMission) {
      updateMission(selectedMission.id, data)
      loadMissions()
      setIsEditDialogOpen(false)
      setSelectedMission(null)
    }
  }

  const handleUpdate = (data: Partial<Mission>) => {
    if (selectedMission) {
      updateMission(selectedMission.id, data)
      loadMissions()
      setSelectedMission({ ...selectedMission, ...data })
    }
  }

  const handleDelete = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette mission ?")) {
      deleteMission(id)
      loadMissions()
    }
  }

  const handleView = (mission: Mission) => {
    setSelectedMission(mission)
    setIsViewDialogOpen(true)
  }

  const handleEditClick = (mission: Mission) => {
    setSelectedMission(mission)
    setIsEditDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des missions</h1>
          <p className="text-muted-foreground mt-2">Suivi des missions d'inspection</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle mission
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher par entreprise, type ou bureau..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statutFilter} onValueChange={setStatutFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="Planifiée">Planifiée</SelectItem>
            <SelectItem value="En cours">En cours</SelectItem>
            <SelectItem value="Terminée">Terminée</SelectItem>
            <SelectItem value="Annulée">Annulée</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <MissionTable missions={filteredMissions} onEdit={handleEditClick} onDelete={handleDelete} onView={handleView} />

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nouvelle mission</DialogTitle>
          </DialogHeader>
          <MissionForm onSubmit={handleAdd} onCancel={() => setIsAddDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier la mission</DialogTitle>
          </DialogHeader>
          {selectedMission && (
            <MissionForm
              mission={selectedMission}
              onSubmit={handleEdit}
              onCancel={() => {
                setIsEditDialogOpen(false)
                setSelectedMission(null)
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails de la mission</DialogTitle>
          </DialogHeader>
          {selectedMission && <MissionDetails mission={selectedMission} onUpdate={handleUpdate} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}
