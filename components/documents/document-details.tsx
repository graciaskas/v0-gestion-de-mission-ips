"use client"

import { FileText, Calendar, Building2, Tag, User, Download, ClipboardList } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import type { Document } from "@/lib/types"

interface DocumentDetailsProps {
  document: Document
}

export function DocumentDetails({ document }: DocumentDetailsProps) {
  const getStatutBadge = (statut: string) => {
    const variants: Record<string, "default" | "secondary" | "outline"> = {
      Actif: "default",
      Archivé: "secondary",
      Obsolète: "outline",
    }
    return <Badge variant={variants[statut] || "default"}>{statut}</Badge>
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold">{document.titre}</h2>
          <p className="text-muted-foreground mt-1">{document.type}</p>
        </div>
        {getStatutBadge(document.statut)}
      </div>

      <Separator />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Informations du document</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Fichier</p>
                <p className="text-sm text-muted-foreground">{document.fichier.nom}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatFileSize(document.fichier.taille)} • {document.fichier.type}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Date de création</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(document.dateCreation).toLocaleDateString("fr-FR")}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Dernière modification</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(document.dateModification).toLocaleDateString("fr-FR")}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <User className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Créé par</p>
                <p className="text-sm text-muted-foreground">{document.creePar}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Associations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {document.entrepriseNom ? (
              <div className="flex items-start gap-3">
                <Building2 className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Entreprise</p>
                  <p className="text-sm text-muted-foreground">{document.entrepriseNom}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Aucune entreprise associée</p>
            )}

            {document.missionType && (
              <div className="flex items-start gap-3">
                <ClipboardList className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Mission</p>
                  <p className="text-sm text-muted-foreground">{document.missionType}</p>
                </div>
              </div>
            )}

            {document.tags.length > 0 && (
              <div className="flex items-start gap-3">
                <Tag className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium mb-2">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {document.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{document.description}</p>
        </CardContent>
      </Card>

      {document.notes && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{document.notes}</p>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end">
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Télécharger le document
        </Button>
      </div>
    </div>
  )
}
