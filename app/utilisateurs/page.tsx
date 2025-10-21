"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Users } from "lucide-react"
import { UserTable } from "@/components/users/user-table"
import { UserForm } from "@/components/users/user-form"

export default function UtilisateursPage() {
  const [showForm, setShowForm] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)

  const handleEdit = (user: any) => {
    setSelectedUser(user)
    setShowForm(true)
  }

  const handleClose = () => {
    setShowForm(false)
    setSelectedUser(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestion des utilisateurs</h1>
          <p className="text-muted-foreground">Gérez les comptes utilisateurs et leurs permissions</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvel utilisateur
        </Button>
      </div>

      {showForm ? (
        <UserForm user={selectedUser} onClose={handleClose} />
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <CardTitle>Liste des utilisateurs</CardTitle>
            </div>
            <CardDescription>Tous les utilisateurs du système</CardDescription>
          </CardHeader>
          <CardContent>
            <UserTable onEdit={handleEdit} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
