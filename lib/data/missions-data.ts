"use client"

import type { Mission } from "@/lib/types"

export const missionsData: Mission[] = [
  {
    id: "1",
    type: "Inspection contrôle",
    bureau: "Hygiène",
    entrepriseId: "1",
    entrepriseNom: "Hôpital Provincial de Kinshasa",
    butMission: "Vérification des normes d'hygiène et de salubrité dans les différents services de l'hôpital",
    dateDebut: "2024-11-20",
    dateFin: "2024-11-22",
    statut: "Terminée",
    inspecteurs: ["Dr. Marie Kalala", "Insp. Jean Mbala"],
    constatsIrregularites: [
      {
        id: "1",
        description: "Absence de savon dans les toilettes du service de pédiatrie",
        categorie: "Hygiène",
      },
      {
        id: "2",
        description: "Poubelles non fermées dans la salle d'attente",
        categorie: "Hygiène",
      },
    ],
    faitsInfractionnels: [
      {
        id: "1",
        description: "Non-respect des protocoles de désinfection des surfaces",
        gravite: "Moyenne",
      },
    ],
    actionsCorrectrices: [
      {
        id: "1",
        deficienceConstatee: "Absence de savon dans les toilettes",
        actionCorrectrice: "Installation de distributeurs de savon liquide dans toutes les toilettes",
        echeance: "2024-12-15",
        responsableSuivi: "Dr. Jean Mukendi",
        observations: "Budget alloué pour l'achat des distributeurs",
        statut: "En cours",
      },
    ],
    dateCreation: "2024-11-15",
  },
]

export function useMissions() {
  const getMissions = (): Mission[] => {
    if (typeof window === "undefined") return missionsData
    const stored = localStorage.getItem("missions")
    return stored ? JSON.parse(stored) : missionsData
  }

  const saveMissions = (missions: Mission[]) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("missions", JSON.stringify(missions))
    }
  }

  const addMission = (mission: Omit<Mission, "id" | "dateCreation">) => {
    const missions = getMissions()
    const newMission: Mission = {
      ...mission,
      id: Date.now().toString(),
      dateCreation: new Date().toISOString().split("T")[0],
    }
    const updated = [...missions, newMission]
    saveMissions(updated)
    return newMission
  }

  const updateMission = (id: string, data: Partial<Mission>) => {
    const missions = getMissions()
    const updated = missions.map((m) => (m.id === id ? { ...m, ...data } : m))
    saveMissions(updated)
  }

  const deleteMission = (id: string) => {
    const missions = getMissions()
    const updated = missions.filter((m) => m.id !== id)
    saveMissions(updated)
  }

  return {
    getMissions,
    addMission,
    updateMission,
    deleteMission,
  }
}
