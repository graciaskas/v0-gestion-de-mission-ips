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
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      setEntreprises(getEntreprises())
      setMissions(getMissions())
      setDocuments(getDocuments())
    }
  }, [mounted])

  if (!mounted) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Tableau de bord</h1>
          <p className=" mt-3 text-base">Chargement...</p>
        </div>
      </div>
    )
  }

  const missionsEnCours = missions.filter((m) => m.statut === "En cours").length
  const actionsEnAttente = missions.reduce(
    (acc, m) => acc + m.actionsCorrectrices.filter((a) => a.statut !== "Terminée").length,
    0,
  )

  const stats = [
    {
      title: "Entreprises enregistrées",
      value: entreprises.length.toString(),
      description: "Total des établissements",
      icon: Building2,
      href: "/entreprises",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "Missions en cours",
      value: missionsEnCours.toString(),
      description: "Missions actives",
      icon: ClipboardList,
      href: "/missions",
      gradient: "from-primary to-emerald-500",
    },
    {
      title: "Documents archivés",
      value: documents.length.toString(),
      description: "Total des documents",
      icon: FileText,
      href: "/documents",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      title: "Actions en attente",
      value: actionsEnAttente.toString(),
      description: "Plans de redressement",
      icon: Clock,
      href: "/rapports",
      gradient: "from-orange-500 to-red-500",
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

  const totalInfractions = missions.reduce((acc, m) => acc + m.faitsInfractionnels.length, 0)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
          Tableau de bord
        </h1>
        <p className=" mt-3 text-base">Vue d'ensemble de l'inspection provinciale de santé</p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.title} href={stat.href}>
              <Card className="group relative overflow-hidden border-border/40 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 cursor-pointer">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${stat.gradient}  opacity-5 transition-opacity duration-300`}
                />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-semibold  text-foreground transition-colors">
                    {stat.title}
                  </CardTitle>
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${stat.gradient} opacity-20 transition-opacity`}
                  >
                    <Icon className="h-5 w-5 text-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold tracking-tight">{stat.value}</div>
                  <p className="text-xs /80 mt-2">{stat.description}</p>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold">Missions récentes</CardTitle>
            <CardDescription className="/80">Dernières missions d'inspection</CardDescription>
          </CardHeader>
          <CardContent>
            {recentMissions.length === 0 ? (
              <p className="text-sm  text-center py-8">Aucune mission enregistrée</p>
            ) : (
              <div className="space-y-2">
                {recentMissions.map((mission) => (
                  <div
                    key={mission.id}
                    className="flex items-start gap-3 p-3 rounded-lg border border-border/40 hover:bg-accent/30 hover:border-primary/20 transition-all duration-200"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-emerald-600 shadow-md shadow-primary/20">
                      <ClipboardList className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 space-y-1.5 min-w-0">
                      <p className="text-sm font-semibold leading-none truncate">{mission.type}</p>
                      <p className="text-sm /90 truncate">{mission.entrepriseNom}</p>
                      <p className="text-xs /70">
                        {new Date(mission.dateDebut).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                    <div className="text-xs /80 font-medium shrink-0">{mission.statut}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold">Actions correctrices en attente</CardTitle>
            <CardDescription className="/80">Plans de redressement à suivre</CardDescription>
          </CardHeader>
          <CardContent>
            {actionsCorrectricesEnAttente.length === 0 ? (
              <p className="text-sm  text-center py-8">Aucune action en attente</p>
            ) : (
              <div className="space-y-2">
                {actionsCorrectricesEnAttente.map((action) => (
                  <div
                    key={action.id}
                    className="flex items-start gap-3 p-3 rounded-lg border border-border/40 hover:bg-accent/30 hover:border-primary/20 transition-all duration-200"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-emerald-600 shadow-md shadow-primary/20">
                      <CheckCircle2 className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 space-y-1.5 min-w-0">
                      <p className="text-sm font-semibold leading-none truncate">{action.deficienceConstatee}</p>
                      <p className="text-sm /90 truncate">{action.entrepriseNom}</p>
                      <p className="text-xs /70">
                        Échéance: {new Date(action.echeance).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                    <div className="text-xs /80 font-medium shrink-0">{action.statut}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <Card className="border-border/40 bg-card/50 backdrop-blur-sm hover:border-orange-500/30 transition-all group">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-500  opacity-5 transition-opacity rounded-lg" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold ">Total des infractions</CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-red-500 opacity-10 opacity-20 transition-opacity">
              <AlertTriangle className="h-5 w-5 text-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{totalInfractions}</div>
            <p className="text-xs /80 mt-2">Faits infractionnels constatés</p>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-emerald-600  opacity-5 transition-opacity rounded-lg" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold ">Missions terminées</CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-emerald-600 opacity-10 opacity-20 transition-opacity">
              <CheckCircle2 className="h-5 w-5 text-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">
              {missions.filter((m) => m.statut === "Terminée").length}
            </div>
            <p className="text-xs /80 mt-2">Inspections complétées</p>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-emerald-600  opacity-5 transition-opacity rounded-lg" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold ">Taux de conformité</CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-emerald-600 opacity-10 opacity-20 transition-opacity">
              <BarChart3 className="h-5 w-5 text-foreground" />
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
            <p className="text-xs /80 mt-2">Entreprises conformes</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
