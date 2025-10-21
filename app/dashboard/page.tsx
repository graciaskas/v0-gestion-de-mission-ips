"use client"

import { useEffect, useState } from "react"
import { Building2, FileText, ClipboardList, BarChart3, AlertTriangle, CheckCircle2, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useEntreprises } from "@/lib/data/entreprises-data"
import { useMissions } from "@/lib/data/missions-data"
import { useDocuments } from "@/lib/data/documents-data"
import type { Entreprise, Mission, Document } from "@/lib/types"

export default function DashboardPage() {
  const { getEntreprises } = useEntreprises()
  const { getMissions } = useMissions()
  const { getDocuments } = useDocuments()

  const [entreprises, setEntreprises] = useState<Entreprise[]>([])
  const [missions, setMissions] = useState<Mission[]>([])
  const [documents, setDocuments] = useState<Document[]>([])

  useEffect(() => {
    setEntreprises(getEntreprises())
    setMissions(getMissions())
    setDocuments(getDocuments())
  }, [])

  const missionsEnCours = missions.filter((m) => m.statut === "En cours").length
  const actionsEnAttente = missions.reduce(
    (acc, m) => acc + m.actionsCorrectrices.filter((a) => a.statut !== "Terminée").length,
    0,
  )
  const totalInfractions = missions.reduce((acc, m) => acc + m.faitsInfractionnels.length, 0)

  const stats = [
    {
      title: "Entreprises enregistrées",
      value: entreprises.length.toString(),
      description: "Total des établissements",
      icon: Building2,
      href: "/entreprises",
    },
    {
      title: "Missions en cours",
      value: missionsEnCours.toString(),
      description: "Missions actives",
      icon: ClipboardList,
      href: "/missions",
    },
    {
      title: "Documents archivés",
      value: documents.length.toString(),
      description: "Total des documents",
      icon: FileText,
      href: "/documents",
    },
    {
      title: "Actions en attente",
      value: actionsEnAttente.toString(),
      description: "Plans de redressement",
      icon: Clock,
      href: "/rapports",
    },
  ]

  const recentMissions = missions
    .slice(0, 5)
    .sort((a, b) => new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime())

  const actionsCorrectricesEnAttente = missions
    .flatMap((m) =>
      m.actionsCorrectrices
        .filter((a) => a.statut !== "Terminée")
        .map((a) => ({
          ...a,
          missionType: m.type,
          entrepriseNom: m.entrepriseNom,
        })),
    )
    .slice(0, 5)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
        <p className="text-muted-foreground mt-2">Vue d'ensemble de l'inspection provinciale de santé</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.title} href={stat.href}>
              <Card className="hover:bg-accent transition-colors cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Missions récentes</CardTitle>
            <CardDescription>Dernières missions d'inspection</CardDescription>
          </CardHeader>
          <CardContent>
            {recentMissions.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">Aucune mission enregistrée</p>
            ) : (
              <div className="space-y-4">
                {recentMissions.map((mission) => (
                  <div key={mission.id} className="flex items-start gap-3 pb-3 border-b last:border-0">
                    <ClipboardList className="h-4 w-4 text-muted-foreground mt-1" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{mission.type}</p>
                      <p className="text-sm text-muted-foreground">{mission.entrepriseNom}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(mission.dateDebut).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground">{mission.statut}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actions correctrices en attente</CardTitle>
            <CardDescription>Plans de redressement à suivre</CardDescription>
          </CardHeader>
          <CardContent>
            {actionsCorrectricesEnAttente.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">Aucune action en attente</p>
            ) : (
              <div className="space-y-4">
                {actionsCorrectricesEnAttente.map((action) => (
                  <div key={action.id} className="flex items-start gap-3 pb-3 border-b last:border-0">
                    <CheckCircle2 className="h-4 w-4 text-blue-500 mt-1" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{action.deficienceConstatee}</p>
                      <p className="text-sm text-muted-foreground">{action.entrepriseNom}</p>
                      <p className="text-xs text-muted-foreground">
                        Échéance: {new Date(action.echeance).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground">{action.statut}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total des infractions</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInfractions}</div>
            <p className="text-xs text-muted-foreground mt-1">Faits infractionnels constatés</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Missions terminées</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{missions.filter((m) => m.statut === "Terminée").length}</div>
            <p className="text-xs text-muted-foreground mt-1">Inspections complétées</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de conformité</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {missions.length > 0
                ? Math.round(
                    ((missions.length - missions.filter((m) => m.faitsInfractionnels.length > 0).length) /
                      missions.length) *
                      100,
                  )
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground mt-1">Entreprises conformes</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
