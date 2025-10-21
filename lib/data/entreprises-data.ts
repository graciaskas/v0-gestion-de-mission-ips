"use client"

import type { Entreprise } from "@/lib/types"

// Données mockées pour démonstration
export const entreprisesData: Entreprise[] = [
  {
    id: "1",
    nom: "Hôpital Provincial de Kinshasa",
    type: "Hopital",
    adresse: "Avenue de la Libération 123",
    ville: "Kinshasa",
    province: "Kinshasa",
    telephone: "+243 123 456 789",
    email: "contact@hopital-kinshasa.cd",
    numeroAutorisation: "AUT-HOP-2023-001",
    dateAutorisation: "2023-01-15",
    statut: "Active",
    responsable: "Dr. Jean Mukendi",
    nombreEmployes: 250,
    dateCreation: "2023-01-15",
    derniereInspection: "2024-11-20",
  },
  {
    id: "2",
    nom: "Pharmacie Centrale",
    type: "Pharmacie",
    adresse: "Boulevard du 30 Juin 45",
    ville: "Kinshasa",
    province: "Kinshasa",
    telephone: "+243 987 654 321",
    email: "info@pharmacie-centrale.cd",
    numeroAutorisation: "AUT-PHA-2023-015",
    dateAutorisation: "2023-03-20",
    statut: "Active",
    responsable: "Pharm. Marie Kabila",
    nombreEmployes: 12,
    dateCreation: "2023-03-20",
    derniereInspection: "2024-10-15",
  },
  {
    id: "3",
    nom: "Hôtel Grand Palace",
    type: "Hotel",
    adresse: "Avenue des Palmiers 78",
    ville: "Kinshasa",
    province: "Kinshasa",
    telephone: "+243 555 123 456",
    email: "reservation@grandpalace.cd",
    numeroAutorisation: "AUT-HOT-2023-008",
    dateAutorisation: "2023-02-10",
    statut: "Active",
    responsable: "M. Pierre Tshisekedi",
    nombreEmployes: 85,
    dateCreation: "2023-02-10",
  },
]

// Hook pour gérer les entreprises (simulé avec localStorage)
export function useEntreprises() {
  const getEntreprises = (): Entreprise[] => {
    if (typeof window === "undefined") return entreprisesData
    const stored = localStorage.getItem("entreprises")
    return stored ? JSON.parse(stored) : entreprisesData
  }

  const saveEntreprises = (entreprises: Entreprise[]) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("entreprises", JSON.stringify(entreprises))
    }
  }

  const addEntreprise = (entreprise: Omit<Entreprise, "id" | "dateCreation">) => {
    const entreprises = getEntreprises()
    const newEntreprise: Entreprise = {
      ...entreprise,
      id: Date.now().toString(),
      dateCreation: new Date().toISOString().split("T")[0],
    }
    const updated = [...entreprises, newEntreprise]
    saveEntreprises(updated)
    return newEntreprise
  }

  const updateEntreprise = (id: string, data: Partial<Entreprise>) => {
    const entreprises = getEntreprises()
    const updated = entreprises.map((e) => (e.id === id ? { ...e, ...data } : e))
    saveEntreprises(updated)
  }

  const deleteEntreprise = (id: string) => {
    const entreprises = getEntreprises()
    const updated = entreprises.filter((e) => e.id !== id)
    saveEntreprises(updated)
  }

  return {
    getEntreprises,
    addEntreprise,
    updateEntreprise,
    deleteEntreprise,
  }
}
