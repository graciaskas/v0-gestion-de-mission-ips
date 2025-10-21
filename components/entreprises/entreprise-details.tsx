"use client"

import { Building2, MapPin, Phone, Mail, Calendar, User, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { Entreprise } from "@/lib/types"

interface EntrepriseDetailsProps {
  entreprise: Entreprise
}

export function EntrepriseDetails({ entreprise }: EntrepriseDetailsProps) {
  const getStatutBadge = (statut: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      Active: "default",
      Inactive: "secondary",
      Suspendue: "destructive",
    }
    return <Badge variant={variants[statut] || "default"}>{statut}</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold">{entreprise.nom}</h2>
          <p className="text-muted-foreground mt-1">{entreprise.type}</p>
        </div>
        {getStatutBadge(entreprise.statut)}
      </div>

      <Separator />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Informations générales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Adresse</p>
                <p className="text-sm text-muted-foreground">
                  {entreprise.adresse}
                  <br />
                  {entreprise.ville}, {entreprise.province}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Téléphone</p>
                <p className="text-sm text-muted-foreground">{entreprise.telephone}</p>
              </div>
            </div>

            {entreprise.email && (
              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{entreprise.email}</p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <User className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Responsable</p>
                <p className="text-sm text-muted-foreground">{entreprise.responsable}</p>
              </div>
            </div>

            {entreprise.nombreEmployes && (
              <div className="flex items-start gap-3">
                <Users className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Nombre d'employés</p>
                  <p className="text-sm text-muted-foreground">{entreprise.nombreEmployes}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Informations administratives</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Building2 className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Numéro d'autorisation</p>
                <p className="text-sm text-muted-foreground">{entreprise.numeroAutorisation}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Date d'autorisation</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(entreprise.dateAutorisation).toLocaleDateString("fr-FR")}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Date de création</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(entreprise.dateCreation).toLocaleDateString("fr-FR")}
                </p>
              </div>
            </div>

            {entreprise.derniereInspection && (
              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Dernière inspection</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(entreprise.derniereInspection).toLocaleDateString("fr-FR")}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {entreprise.notes && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{entreprise.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
