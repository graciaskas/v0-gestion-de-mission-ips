"use client"

import { useState, useEffect } from "react"
import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DocumentTable } from "@/components/documents/document-table"
import { DocumentForm } from "@/components/documents/document-form"
import { DocumentDetails } from "@/components/documents/document-details"
import { useDocuments } from "@/lib/data/documents-data"
import type { Document } from "@/lib/types"

export default function DocumentsPage() {
  const { getDocuments, addDocument, updateDocument, deleteDocument } = useDocuments()
  const [documents, setDocuments] = useState<Document[]>([])
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [statutFilter, setStatutFilter] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)

  useEffect(() => {
    loadDocuments()
  }, [])

  useEffect(() => {
    filterDocuments()
  }, [documents, searchTerm, typeFilter, statutFilter])

  const loadDocuments = () => {
    setDocuments(getDocuments())
  }

  const filterDocuments = () => {
    let filtered = documents

    if (searchTerm) {
      filtered = filtered.filter(
        (d) =>
          d.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.entrepriseNom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((d) => d.type === typeFilter)
    }

    if (statutFilter !== "all") {
      filtered = filtered.filter((d) => d.statut === statutFilter)
    }

    setFilteredDocuments(filtered)
  }

  const handleAdd = (data: Partial<Document>) => {
    addDocument(data as Omit<Document, "id" | "dateCreation" | "dateModification">)
    loadDocuments()
    setIsAddDialogOpen(false)
  }

  const handleEdit = (data: Partial<Document>) => {
    if (selectedDocument) {
      updateDocument(selectedDocument.id, data)
      loadDocuments()
      setIsEditDialogOpen(false)
      setSelectedDocument(null)
    }
  }

  const handleDelete = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce document ?")) {
      deleteDocument(id)
      loadDocuments()
    }
  }

  const handleView = (document: Document) => {
    setSelectedDocument(document)
    setIsViewDialogOpen(true)
  }

  const handleEditClick = (document: Document) => {
    setSelectedDocument(document)
    setIsEditDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion documentaire</h1>
          <p className="text-muted-foreground mt-2">Archivage et gestion des documents</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau document
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher par titre, description, entreprise ou tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Type de document" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            <SelectItem value="Rapport d'inspection">Rapport d'inspection</SelectItem>
            <SelectItem value="Procès-verbal">Procès-verbal</SelectItem>
            <SelectItem value="Autorisation">Autorisation</SelectItem>
            <SelectItem value="Certificat">Certificat</SelectItem>
            <SelectItem value="Correspondance">Correspondance</SelectItem>
            <SelectItem value="Photo">Photo</SelectItem>
            <SelectItem value="Plan de redressement">Plan de redressement</SelectItem>
            <SelectItem value="Autre">Autre</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statutFilter} onValueChange={setStatutFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="Actif">Actif</SelectItem>
            <SelectItem value="Archivé">Archivé</SelectItem>
            <SelectItem value="Obsolète">Obsolète</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DocumentTable
        documents={filteredDocuments}
        onEdit={handleEditClick}
        onDelete={handleDelete}
        onView={handleView}
      />

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nouveau document</DialogTitle>
          </DialogHeader>
          <DocumentForm onSubmit={handleAdd} onCancel={() => setIsAddDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier le document</DialogTitle>
          </DialogHeader>
          {selectedDocument && (
            <DocumentForm
              document={selectedDocument}
              onSubmit={handleEdit}
              onCancel={() => {
                setIsEditDialogOpen(false)
                setSelectedDocument(null)
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails du document</DialogTitle>
          </DialogHeader>
          {selectedDocument && <DocumentDetails document={selectedDocument} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}
