"use client"

import type { Document } from "@/lib/types"

export const documentsData: Document[] = [
  {
    id: "1",
    titre: "Rapport d'inspection - Hôpital Provincial",
    type: "Rapport d'inspection",
    description: "Rapport complet de l'inspection d'hygiène effectuée le 20 novembre 2024",
    dateCreation: "2024-11-22",
    dateModification: "2024-11-22",
    statut: "Actif",
    entrepriseId: "1",
    entrepriseNom: "Hôpital Provincial de Kinshasa",
    missionId: "1",
    missionType: "Inspection contrôle",
    fichier: {
      nom: "rapport-inspection-hopital-2024-11.pdf",
      taille: 2458000,
      type: "application/pdf",
      url: "#",
    },
    tags: ["hygiène", "inspection", "2024"],
    creePar: "Dr. Marie Kalala",
  },
  {
    id: "2",
    titre: "Autorisation d'exploitation - Pharmacie Centrale",
    type: "Autorisation",
    description: "Document d'autorisation officielle pour l'exploitation de la pharmacie",
    dateCreation: "2023-03-20",
    dateModification: "2023-03-20",
    statut: "Actif",
    entrepriseId: "2",
    entrepriseNom: "Pharmacie Centrale",
    fichier: {
      nom: "autorisation-pharmacie-centrale.pdf",
      taille: 856000,
      type: "application/pdf",
      url: "#",
    },
    tags: ["autorisation", "pharmacie"],
    creePar: "Admin IPS",
  },
]

export function useDocuments() {
  const getDocuments = (): Document[] => {
    if (typeof window === "undefined") return documentsData
    const stored = localStorage.getItem("documents")
    return stored ? JSON.parse(stored) : documentsData
  }

  const saveDocuments = (documents: Document[]) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("documents", JSON.stringify(documents))
    }
  }

  const addDocument = (document: Omit<Document, "id" | "dateCreation" | "dateModification">) => {
    const documents = getDocuments()
    const now = new Date().toISOString().split("T")[0]
    const newDocument: Document = {
      ...document,
      id: Date.now().toString(),
      dateCreation: now,
      dateModification: now,
    }
    const updated = [...documents, newDocument]
    saveDocuments(updated)
    return newDocument
  }

  const updateDocument = (id: string, data: Partial<Document>) => {
    const documents = getDocuments()
    const updated = documents.map((d) =>
      d.id === id
        ? {
            ...d,
            ...data,
            dateModification: new Date().toISOString().split("T")[0],
          }
        : d,
    )
    saveDocuments(updated)
  }

  const deleteDocument = (id: string) => {
    const documents = getDocuments()
    const updated = documents.filter((d) => d.id !== id)
    saveDocuments(updated)
  }

  return {
    getDocuments,
    addDocument,
    updateDocument,
    deleteDocument,
  }
}
