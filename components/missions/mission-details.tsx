"use client"

import { useState } from "react"
import { Calendar, Building2, Users, FileText, AlertTriangle, CheckCircle2, Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ConstatForm } from "./constat-form"
import { InfractionForm } from "./infraction-form"
import { ActionCorrectrice as ActionCorrectriceForm } from "./action-correctrice-form"
import type { Mission } from "@/lib/types"

interface MissionDetailsProps {
  mission: Mission
  onUpdate: (data: Partial<Mission>) => void
}

export function MissionDetails({ mission, onUpdate }: MissionDetailsProps) {
  const [showConstatForm, setShowConstatForm] = useState(false)
  const [showInfractionForm, setShowInfractionForm] = useState(false)
  const [showActionForm, setShowActionForm] = useState(false)

  const getStatutBadge = (statut: string) => {
    const variants: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
      Planifiée: "outline",
      "En cours": "default",
      Terminée: "secondary",
      Annulée: "destructive",
    }
    return <Badge variant={variants[statut] || "default"}>{statut}</Badge>
  }

  const getGraviteBadge = (gravite: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      Faible: "secondary",
      Moyenne: "default",
      Élevée: "destructive",
    }
    return <Badge variant={variants[gravite] || "default"}>{gravite}</Badge>
  }

  const getActionStatutBadge = (statut: string) => {
    const variants: Record<string, "default" | "secondary" | "outline"> = {
      "En attente": "outline",
      "En cours": "default",
      Terminée: "secondary",
    }
    return <Badge variant={variants[statut] || "default"}>{statut}</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold">{mission.type}</h2>
          <p className="text-muted-foreground mt-1">{mission.bureau}</p>
        </div>
        {getStatutBadge(mission.statut)}
      </div>

      <Separator />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Informations générales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Building2 className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Entreprise inspectée</p>
                <p className="text-sm text-muted-foreground">{mission.entrepriseNom}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Période</p>
                <p className="text-sm text-muted-foreground">
                  Du {new Date(mission.dateDebut).toLocaleDateString("fr-FR")}
                  {mission.dateFin && ` au ${new Date(mission.dateFin).toLocaleDateString("fr-FR")}`}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Users className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Inspecteurs</p>
                <p className="text-sm text-muted-foreground">{mission.inspecteurs.join(", ")}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">But de la mission</p>
                <p className="text-sm text-muted-foreground">{mission.butMission}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Résumé</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Constats d'irrégularités</span>
              <span className="text-2xl font-bold">{mission.constatsIrregularites.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Faits infractionnels</span>
              <span className="text-2xl font-bold">{mission.faitsInfractionnels.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Actions correctrices</span>
              <span className="text-2xl font-bold">{mission.actionsCorrectrices.length}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="constats" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="constats">Constats d'irrégularités</TabsTrigger>
          <TabsTrigger value="infractions">Faits infractionnels</TabsTrigger>
          <TabsTrigger value="actions">Plan de redressement</TabsTrigger>
        </TabsList>

        <TabsContent value="constats" className="space-y-4">
          <div className="flex justify-end">
            <Button size="sm" onClick={() => setShowConstatForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un constat
            </Button>
          </div>

          {showConstatForm && (
            <Card>
              <CardContent className="pt-6">
                <ConstatForm
                  onSubmit={(constat) => {
                    onUpdate({
                      constatsIrregularites: [
                        ...mission.constatsIrregularites,
                        { ...constat, id: Date.now().toString() },
                      ],
                    })
                    setShowConstatForm(false)
                  }}
                  onCancel={() => setShowConstatForm(false)}
                />
              </CardContent>
            </Card>
          )}

          {mission.constatsIrregularites.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Aucun constat d'irrégularité enregistré
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {mission.constatsIrregularites.map((constat) => (
                <Card key={constat.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{constat.categorie}</Badge>
                        </div>
                        <p className="text-sm">{constat.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="infractions" className="space-y-4">
          <div className="flex justify-end">
            <Button size="sm" onClick={() => setShowInfractionForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter une infraction
            </Button>
          </div>

          {showInfractionForm && (
            <Card>
              <CardContent className="pt-6">
                <InfractionForm
                  onSubmit={(infraction) => {
                    onUpdate({
                      faitsInfractionnels: [
                        ...mission.faitsInfractionnels,
                        { ...infraction, id: Date.now().toString() },
                      ],
                    })
                    setShowInfractionForm(false)
                  }}
                  onCancel={() => setShowInfractionForm(false)}
                />
              </CardContent>
            </Card>
          )}

          {mission.faitsInfractionnels.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Aucun fait infractionnel enregistré
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {mission.faitsInfractionnels.map((infraction) => (
                <Card key={infraction.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">{getGraviteBadge(infraction.gravite)}</div>
                        <p className="text-sm">{infraction.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="actions" className="space-y-4">
          <div className="flex justify-end">
            <Button size="sm" onClick={() => setShowActionForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter une action
            </Button>
          </div>

          {showActionForm && (
            <Card>
              <CardContent className="pt-6">
                <ActionCorrectriceForm
                  onSubmit={(action) => {
                    onUpdate({
                      actionsCorrectrices: [...mission.actionsCorrectrices, { ...action, id: Date.now().toString() }],
                    })
                    setShowActionForm(false)
                  }}
                  onCancel={() => setShowActionForm(false)}
                />
              </CardContent>
            </Card>
          )}

          {mission.actionsCorrectrices.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Aucune action correctrice planifiée
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {mission.actionsCorrectrices.map((action) => (
                <Card key={action.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Déficience constatée</h4>
                          {getActionStatutBadge(action.statut)}
                        </div>
                        <p className="text-sm text-muted-foreground">{action.deficienceConstatee}</p>

                        <div>
                          <h4 className="font-medium text-sm mb-1">Action correctrice</h4>
                          <p className="text-sm text-muted-foreground">{action.actionCorrectrice}</p>
                        </div>

                        <div className="grid gap-2 md:grid-cols-2 text-sm">
                          <div>
                            <span className="font-medium">Échéance: </span>
                            <span className="text-muted-foreground">
                              {new Date(action.echeance).toLocaleDateString("fr-FR")}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium">Responsable: </span>
                            <span className="text-muted-foreground">{action.responsableSuivi}</span>
                          </div>
                        </div>

                        {action.observations && (
                          <div>
                            <h4 className="font-medium text-sm mb-1">Observations</h4>
                            <p className="text-sm text-muted-foreground">{action.observations}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
