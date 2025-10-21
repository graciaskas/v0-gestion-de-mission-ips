"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface User {
  id: string
  name: string
  email: string
  role: string
  bureau?: string
  actif: boolean
}

interface UserTableProps {
  onEdit: (user: User) => void
}

export function UserTable({ onEdit }: UserTableProps) {
  const { toast } = useToast()
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    // Mock data - remplacer par un vrai appel API
    setUsers([
      {
        id: "1",
        name: "Admin Principal",
        email: "admin@ips.gov",
        role: "ADMIN",
        actif: true,
      },
      {
        id: "2",
        name: "Dr. Jean Dupont",
        email: "j.dupont@ips.gov",
        role: "INSPECTEUR",
        bureau: "Médicaux techniques",
        actif: true,
      },
    ])
  }, [])

  const getRoleLabel = (role: string) => {
    const roles: Record<string, string> = {
      ADMIN: "Administrateur",
      CHEF_SERVICE: "Chef de service",
      INSPECTEUR: "Inspecteur",
      ARCHIVISTE: "Archiviste",
    }
    return roles[role] || role
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "destructive"
      case "CHEF_SERVICE":
        return "default"
      default:
        return "secondary"
    }
  }

  const handleDelete = (userId: string) => {
    toast({
      title: "Utilisateur supprimé",
      description: "L'utilisateur a été supprimé avec succès.",
    })
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nom</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Rôle</TableHead>
          <TableHead>Bureau</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              <Badge variant={getRoleBadgeVariant(user.role)}>{getRoleLabel(user.role)}</Badge>
            </TableCell>
            <TableCell>{user.bureau || "-"}</TableCell>
            <TableCell>
              <Badge variant={user.actif ? "default" : "secondary"}>{user.actif ? "Actif" : "Inactif"}</Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="icon" onClick={() => onEdit(user)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(user.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
