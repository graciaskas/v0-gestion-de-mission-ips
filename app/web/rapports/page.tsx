"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Download, FileText, Building2, ClipboardList, AlertTriangle } from "lucide-react"
import { useEntreprises } from "@/lib/data/entreprises-data"
import { useMissions } from "@/lib/data/missions-data"
import { useDocuments } from "@/lib/data/documents-data"
import type { Entreprise, Mission, Document } from "@/lib/types"
import { Badge } from "@/components/ui/badge"

export default function RapportsPage() {
  const { getEntreprises } = useEntreprises()
  const { getMissions } = useMissions()
  const { getDocuments } = useDocuments()

  const [entreprises, setEntreprises] = useState<Entreprise[]>([])
  const [missions, setMissions] = useState<Mission[]>([])
  const [documents, setDocuments] = useState<Document[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState("all")

  useEffect(() => {
    setEntreprises(getEntreprises())
    setMissions(getMissions())
    setDocuments(getDocuments())
  }, [])

  // Statistiques par type d'entreprise
  const entreprisesByType = entreprises.reduce(
    (acc, e) => {
      acc[e.type] = (acc[e.type] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // Statistiques par type de mission
  const missionsByType = missions.reduce(
    (acc, m) => {
      acc[m.type] = (acc[m.type] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // Statistiques par bureau
  const missionsByBureau = missions.reduce(
    (acc, m) => {
      acc[m.bureau] = (acc[m.bureau] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // Infractions par gravité
  const infractionsByGravite = missions.reduce(
    (acc, m) => {
      m.faitsInfractionnels.forEach((f) => {
        acc[f.gravite] = (acc[f.gravite] || 0) + 1
      })
      return acc
    },
    {} as Record<string, number>,
  )

  // Actions correctrices par statut
  const actionsByStatut = missions.reduce(
    (acc, m) => {
      m.actionsCorrectrices.forEach((a) => {
        acc[a.statut] = (acc[a.statut] || 0) + 1
      })
      return acc
    },
    {} as Record<string, number>,
  )

  // Top 5 entreprises avec le plus d'infractions
  const entreprisesWithInfractions = missions
    .reduce(
      (acc, m) => {
        const existing = acc.find((e) => e.entrepriseId === m.entrepriseId)
        if (existing) {
          existing.infractions += m.faitsInfractionnels.length
        } else {
          acc.push({
            entrepriseId: m.entrepriseId,
            entrepriseNom: m.entrepriseNom,
            infractions: m.faitsInfractionnels.length,
          })
        }
        return acc
      },
      [] as Array<{ entrepriseId: string; entrepriseNom: string; infractions: number }>,
    )
    .sort((a, b) => b.infractions - a.infractions)
    .slice(0, 5)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rapports et statistiques</h1>
          <p className="text-muted-foreground mt-2">Analyse et génération de rapports</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les périodes</SelectItem>
              <SelectItem value="month">Ce mois</SelectItem>
              <SelectItem value="quarter">Ce trimestre</SelectItem>
              <SelectItem value="year">Cette année</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="entreprises">Entreprises</TabsTrigger>
          <TabsTrigger value="missions">Missions</TabsTrigger>
          <TabsTrigger value="infractions">Infractions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total entreprises</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{entreprises.length}</div>
                <p className="text-xs text-muted-foreground mt-1">Établissements enregistrés</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total missions</CardTitle>
                <ClipboardList className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{missions.length}</div>
                <p className="text-xs text-muted-foreground mt-1">Inspections effectuées</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total documents</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{documents.length}</div>
                <p className="text-xs text-muted-foreground mt-1">Documents archivés</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total infractions</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {missions.reduce((acc, m) => acc + m.faitsInfractionnels.length, 0)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Faits constatés</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Missions par statut</CardTitle>
                <CardDescription>Répartition des missions selon leur statut</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {["Planifiée", "En cours", "Terminée", "Annulée"].map((statut) => {
                    const count = missions.filter((m) => m.statut === statut).length
                    const percentage = missions.length > 0 ? (count / missions.length) * 100 : 0
                    return (
                      <div key={statut} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>{statut}</span>
                          <span className="font-medium">
                            {count} ({percentage.toFixed(0)}%)
                          </span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${percentage}%` }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actions correctrices</CardTitle>
                <CardDescription>État d'avancement des plans de redressement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(actionsByStatut).map(([statut, count]) => {
                    const total = Object.values(actionsByStatut).reduce((a, b) => a + b, 0)
                    const percentage = total > 0 ? (count / total) * 100 : 0
                    return (
                      <div key={statut} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>{statut}</span>
                          <span className="font-medium">
                            {count} ({percentage.toFixed(0)}%)
                          </span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${percentage}%` }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="entreprises" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Répartition par type d'établissement</CardTitle>
              <CardDescription>Nombre d'entreprises par catégorie</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(entreprisesByType)
                  .sort(([, a], [, b]) => b - a)
                  .map(([type, count]) => {
                    const percentage = (count / entreprises.length) * 100
                    return (
                      <div key={type} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>{type}</span>
                          <span className="font-medium">
                            {count} ({percentage.toFixed(0)}%)
                          </span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${percentage}%` }} />
                        </div>
                      </div>
                    )
                  })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Entreprises par statut</CardTitle>
              <CardDescription>État d'activité des établissements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {["Active", "Inactive", "Suspendue"].map((statut) => {
                  const count = entreprises.filter((e) => e.statut === statut).length
                  const percentage = entreprises.length > 0 ? (count / entreprises.length) * 100 : 0
                  return (
                    <div key={statut} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>{statut}</span>
                        <span className="font-medium">
                          {count} ({percentage.toFixed(0)}%)
                        </span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${percentage}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="missions" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Missions par type</CardTitle>
                <CardDescription>Répartition selon le type d'inspection</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(missionsByType)
                    .sort(([, a], [, b]) => b - a)
                    .map(([type, count]) => {
                      const percentage = (count / missions.length) * 100
                      return (
                        <div key={type} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>{type}</span>
                            <span className="font-medium">
                              {count} ({percentage.toFixed(0)}%)
                            </span>
                          </div>
                          <div className="h-2 bg-secondary rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${percentage}%` }} />
                          </div>
                        </div>
                      )
                    })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Missions par bureau</CardTitle>
                <CardDescription>Activité par département</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(missionsByBureau)
                    .sort(([, a], [, b]) => b - a)
                    .map(([bureau, count]) => {
                      const percentage = (count / missions.length) * 100
                      return (
                        <div key={bureau} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>{bureau}</span>
                            <span className="font-medium">
                              {count} ({percentage.toFixed(0)}%)
                            </span>
                          </div>
                          <div className="h-2 bg-secondary rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${percentage}%` }} />
                          </div>
                        </div>
                      )
                    })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="infractions" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Infractions par gravité</CardTitle>
                <CardDescription>Classification des faits infractionnels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(infractionsByGravite)
                    .sort(([, a], [, b]) => b - a)
                    .map(([gravite, count]) => {
                      const total = Object.values(infractionsByGravite).reduce((a, b) => a + b, 0)
                      const percentage = total > 0 ? (count / total) * 100 : 0
                      return (
                        <div key={gravite} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>{gravite}</span>
                            <span className="font-medium">
                              {count} ({percentage.toFixed(0)}%)
                            </span>
                          </div>
                          <div className="h-2 bg-secondary rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${percentage}%` }} />
                          </div>
                        </div>
                      )
                    })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Entreprises avec infractions</CardTitle>
                <CardDescription>Top 5 des établissements</CardDescription>
              </CardHeader>
              <CardContent>
                {entreprisesWithInfractions.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">Aucune infraction enregistrée</p>
                ) : (
                  <div className="space-y-4">
                    {entreprisesWithInfractions.map((e, index) => (
                      <div key={e.entrepriseId} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                            {index + 1}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{e.entrepriseNom}</p>
                          </div>
                        </div>
                        <Badge variant="destructive">{e.infractions}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
