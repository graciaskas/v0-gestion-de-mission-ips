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
import type { Entreprise } from "@/lib/types"

interface EntrepriseTableProps {
  entreprises: Entreprise[]
  onEdit: (entreprise: Entreprise) => void
  onDelete: (id: string) => void
  onView: (entreprise: Entreprise) => void
}

export function EntrepriseTable({ entreprises, onEdit, onDelete, onView }: EntrepriseTableProps) {
  const getStatutBadge = (statut: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      Active: "default",
      Inactive: "secondary",
      Suspendue: "destructive",
    }
    return <Badge variant={variants[statut] || "default"}>{statut}</Badge>
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Ville</TableHead>
            <TableHead>Responsable</TableHead>
            <TableHead>Téléphone</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Dernière inspection</TableHead>
            <TableHead className="w-[70px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entreprises.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                Aucune entreprise enregistrée
              </TableCell>
            </TableRow>
          ) : (
            entreprises.map((entreprise) => (
              <TableRow key={entreprise.id}>
                <TableCell className="font-medium">{entreprise.nom}</TableCell>
                <TableCell>{entreprise.type}</TableCell>
                <TableCell>{entreprise.ville}</TableCell>
                <TableCell>{entreprise.responsable}</TableCell>
                <TableCell>{entreprise.telephone}</TableCell>
                <TableCell>{getStatutBadge(entreprise.statut)}</TableCell>
                <TableCell>
                  {entreprise.derniereInspection
                    ? new Date(entreprise.derniereInspection).toLocaleDateString("fr-FR")
                    : "Jamais"}
                </TableCell>
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
                      <DropdownMenuItem onClick={() => onView(entreprise)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Voir les détails
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(entreprise)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDelete(entreprise.id)} className="text-destructive">
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
