export type TypeEntreprise =
  | "Hotel"
  | "Hopital"
  | "Pharmacie"
  | "Centre de santé"
  | "Clinique"
  | "Laboratoire"
  | "Cabinet médical"
  | "Autre"

export type StatutEntreprise = "Active" | "Inactive" | "Suspendue"

export interface Entreprise {
  id: string
  nom: string
  type: TypeEntreprise
  adresse: string
  ville: string
  province: string
  telephone: string
  email: string
  numeroAutorisation: string
  dateAutorisation: string
  statut: StatutEntreprise
  responsable: string
  nombreEmployes?: number
  dateCreation: string
  derniereInspection?: string
  notes?: string
}

export type TypeMission = "Inspection contrôle" | "Encadrement" | "Audit" | "Enquête"

export type BureauMission =
  | "Médicaux techniques"
  | "Hygiène"
  | "Personne"
  | "Ressources"
  | "Pharmacie"
  | "Plantes médicinales"
  | "Enseignement"

export type StatutMission = "Planifiée" | "En cours" | "Terminée" | "Annulée"

export interface ConstatIrregularite {
  id: string
  description: string
  categorie: string
}

export interface FaitInfractionnel {
  id: string
  description: string
  gravite: "Faible" | "Moyenne" | "Élevée"
}

export interface ActionCorrectrice {
  id: string
  deficienceConstatee: string
  actionCorrectrice: string
  echeance: string
  responsableSuivi: string
  observations: string
  statut: "En attente" | "En cours" | "Terminée"
}

export interface Mission {
  id: string
  type: TypeMission
  bureau: BureauMission
  entrepriseId: string
  entrepriseNom: string
  butMission: string
  dateDebut: string
  dateFin?: string
  statut: StatutMission
  inspecteurs: string[]
  constatsIrregularites: ConstatIrregularite[]
  faitsInfractionnels: FaitInfractionnel[]
  actionsCorrectrices: ActionCorrectrice[]
  dateCreation: string
  notes?: string
}

export type TypeDocument =
  | "Rapport d'inspection"
  | "Procès-verbal"
  | "Autorisation"
  | "Certificat"
  | "Correspondance"
  | "Photo"
  | "Plan de redressement"
  | "Autre"

export type StatutDocument = "Actif" | "Archivé" | "Obsolète"

export interface Document {
  id: string
  titre: string
  type: TypeDocument
  description: string
  dateCreation: string
  dateModification: string
  statut: StatutDocument
  entrepriseId?: string
  entrepriseNom?: string
  missionId?: string
  missionType?: string
  fichier: {
    nom: string
    taille: number
    type: string
    url: string
  }
  tags: string[]
  creePar: string
  notes?: string
}
