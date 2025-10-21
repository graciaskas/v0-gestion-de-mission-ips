"use client"

import { MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { Mission } from "@/lib/types"

interface MissionTableProps {
  missions: Mission[]
  onEdit: (mission: Mission) => void
  onDelete: (id: string) => void
  onView: (mission: Mission) => void
}

export function MissionTable({ missions, onEdit, onDelete, onView }: MissionTableProps) {
  const getStatutBadge = (statut: string) => {
    const variants: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
      Planifiée: "outline",
      "En cours": "default",
      Terminée: "secondary",
      Annulée: "destructive",
    }
    return <Badge variant={variants[statut] || "default"}>{statut}</Badge>
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Bureau</TableHead>
            <TableHead>Entreprise</TableHead>
            <TableHead>Date début</TableHead>
            <TableHead>Inspecteurs</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="w-[70px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {missions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                Aucune mission enregistrée
              </TableCell>
            </TableRow>
          ) : (
            missions.map((mission) => (
              <TableRow key={mission.id}>
                <TableCell className="font-medium">{mission.type}</TableCell>
                <TableCell>{mission.bureau}</TableCell>
                <TableCell>{mission.entrepriseNom}</TableCell>
                <TableCell>{new Date(mission.dateDebut).toLocaleDateString("fr-FR")}</TableCell>
                <TableCell>{mission.inspecteurs.slice(0, 2).join(", ")}</TableCell>
                <TableCell>{getStatutBadge(mission.statut)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Ouvrir le menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onView(mission)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Voir les détails
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(mission)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDelete(mission.id)} className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
