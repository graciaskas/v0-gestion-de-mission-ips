"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface UserFormProps {
  user?: any
  onClose: () => void
}

export function UserForm({ user, onClose }: UserFormProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
    role: user?.role || "INSPECTEUR",
    bureau: user?.bureau || "",
    telephone: user?.telephone || "",
    actif: user?.actif ?? true,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: user ? "Utilisateur modifié" : "Utilisateur créé",
      description: "Les informations ont été enregistrées avec succès.",
    })
    onClose()
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{user ? "Modifier" : "Nouvel"} utilisateur</CardTitle>
            <CardDescription>
              {user ? "Modifiez les informations de l'utilisateur" : "Créez un nouveau compte utilisateur"}
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nom complet *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe {!user && "*"}</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required={!user}
                placeholder={user ? "Laisser vide pour ne pas changer" : ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Rôle *</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Administrateur</SelectItem>
                  <SelectItem value="CHEF_SERVICE">Chef de service</SelectItem>
                  <SelectItem value="INSPECTEUR">Inspecteur</SelectItem>
                  <SelectItem value="ARCHIVISTE">Archiviste</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bureau">Bureau</Label>
              <Select value={formData.bureau} onValueChange={(value) => setFormData({ ...formData, bureau: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un bureau" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Médicaux techniques">Médicaux techniques</SelectItem>
                  <SelectItem value="Hygiène">Hygiène</SelectItem>
                  <SelectItem value="Personne">Personne</SelectItem>
                  <SelectItem value="Ressources">Ressources</SelectItem>
                  <SelectItem value="Pharmacie">Pharmacie</SelectItem>
                  <SelectItem value="Plantes médicinales">Plantes médicinales</SelectItem>
                  <SelectItem value="Enseignement">Enseignement</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="telephone">Téléphone</Label>
              <Input
                id="telephone"
                value={formData.telephone}
                onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Compte actif</Label>
              <p className="text-sm text-muted-foreground">L'utilisateur peut se connecter au système</p>
            </div>
            <Switch
              checked={formData.actif}
              onCheckedChange={(checked) => setFormData({ ...formData, actif: checked })}
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit">{user ? "Enregistrer les modifications" : "Créer l'utilisateur"}</Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
