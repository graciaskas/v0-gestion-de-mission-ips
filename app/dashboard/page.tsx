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
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">Tableau de bord</h1>
        <p className="text-muted-foreground mt-3 text-base">Vue d'ensemble de l'inspection provinciale de santé</p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.title} href={stat.href}>
              <Card className="hover:bg-accent/50 transition-all duration-300 cursor-pointer border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 group bg-card/50 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors">{stat.title}</CardTitle>
                  <Icon className="h-5 w-5 text-muted-foreground/60 group-hover:text-primary transition-colors" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold tracking-tight">{stat.value}</div>
                  <p className="text-xs text-muted-foreground/80 mt-2">{stat.description}</p>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold">Missions récentes</CardTitle>
            <CardDescription className="text-muted-foreground/80">Dernières missions d'inspection</CardDescription>
          </CardHeader>
          <CardContent>
            {recentMissions.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">Aucune mission enregistrée</p>
            ) : (
              <div className="space-y-3">
                {recentMissions.map((mission) => (
                  <div key={mission.id} className="flex items-start gap-3 pb-3 border-b border-border/50 last:border-0 hover:bg-accent/30 -mx-3 px-3 py-2 rounded-lg transition-colors">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                      <ClipboardList className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <p className="text-sm font-semibold leading-none">{mission.type}</p>
                      <p className="text-sm text-muted-foreground/90">{mission.entrepriseNom}</p>
                      <p className="text-xs text-muted-foreground/70">
                        {new Date(mission.dateDebut).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground/80 font-medium">{mission.statut}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold">Actions correctrices en attente</CardTitle>
            <CardDescription className="text-muted-foreground/80">Plans de redressement à suivre</CardDescription>
          </CardHeader>
          <CardContent>
            {actionsCorrectricesEnAttente.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">Aucune action en attente</p>
            ) : (
              <div className="space-y-3">
                {actionsCorrectricesEnAttente.map((action) => (
                  <div key={action.id} className="flex items-start gap-3 pb-3 border-b border-border/50 last:border-0 hover:bg-accent/30 -mx-3 px-3 py-2 rounded-lg transition-colors">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <p className="text-sm font-semibold leading-none">{action.deficienceConstatee}</p>
                      <p className="text-sm text-muted-foreground/90">{action.entrepriseNom}</p>
                      <p className="text-xs text-muted-foreground/70">
                        Échéance: {new Date(action.echeance).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground/80 font-medium">{action.statut}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-accent/30 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Total des infractions</CardTitle>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/10">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{totalInfractions}</div>
            <p className="text-xs text-muted-foreground/80 mt-2">Faits infractionnels constatés</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-accent/30 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Missions terminées</CardTitle>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <CheckCircle2 className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{missions.filter((m) => m.statut === "Terminée").length}</div>
            <p className="text-xs text-muted-foreground/80 mt-2">Inspections complétées</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-accent/30 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Taux de conformité</CardTitle>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">
              {missions.length > 0
                ? Math.round(
                    ((missions.length - missions.filter((m) => m.faitsInfractionnels.length > 0).length) /
                      missions.length) *
                      100,
                  )
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground/80 mt-2">Entreprises conformes</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
