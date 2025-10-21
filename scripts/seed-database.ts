import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("[v0] Starting database seed...")

  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 10)

  const admin = await prisma.user.upsert({
    where: { email: "admin@ips.gov" },
    update: {},
    create: {
      email: "admin@ips.gov",
      name: "Administrateur Principal",
      password: hashedPassword,
      role: "ADMIN",
      actif: true,
    },
  })

  console.log("[v0] Created admin user:", admin.email)

  // Create inspectors
  const inspecteur1 = await prisma.user.upsert({
    where: { email: "j.dupont@ips.gov" },
    update: {},
    create: {
      email: "j.dupont@ips.gov",
      name: "Dr. Jean Dupont",
      password: hashedPassword,
      role: "INSPECTEUR",
      bureau: "Médicaux techniques",
      telephone: "+243 123 456 789",
      actif: true,
    },
  })

  const inspecteur2 = await prisma.user.upsert({
    where: { email: "m.martin@ips.gov" },
    update: {},
    create: {
      email: "m.martin@ips.gov",
      name: "Marie Martin",
      password: hashedPassword,
      role: "INSPECTEUR",
      bureau: "Hygiène",
      telephone: "+243 987 654 321",
      actif: true,
    },
  })

  console.log("[v0] Created inspectors")

  // Create sample enterprises
  const hopital = await prisma.entreprise.create({
    data: {
      nom: "Hôpital Général de Kinshasa",
      type: "HOPITAL",
      adresse: "123 Avenue de la Santé",
      ville: "Kinshasa",
      telephone: "+243 111 222 333",
      email: "contact@hopital-kinshasa.cd",
      numeroAutorisation: "AUT-HOP-2024-001",
      dateAutorisation: new Date("2024-01-15"),
      responsable: "Dr. Pierre Kabila",
      telephoneResponsable: "+243 111 222 334",
      statut: "ACTIVE",
    },
  })

  const pharmacie = await prisma.entreprise.create({
    data: {
      nom: "Pharmacie Centrale",
      type: "PHARMACIE",
      adresse: "45 Boulevard du Commerce",
      ville: "Kinshasa",
      telephone: "+243 222 333 444",
      email: "info@pharmacie-centrale.cd",
      numeroAutorisation: "AUT-PHA-2024-002",
      dateAutorisation: new Date("2024-02-20"),
      responsable: "Mme. Sophie Lumbu",
      telephoneResponsable: "+243 222 333 445",
      statut: "ACTIVE",
    },
  })

  const hotel = await prisma.entreprise.create({
    data: {
      nom: "Hôtel Grand Palace",
      type: "HOTEL",
      adresse: "78 Avenue des Palmiers",
      ville: "Kinshasa",
      telephone: "+243 333 444 555",
      email: "reservation@grandpalace.cd",
      numeroAutorisation: "AUT-HOT-2024-003",
      dateAutorisation: new Date("2024-03-10"),
      responsable: "M. Joseph Tshisekedi",
      telephoneResponsable: "+243 333 444 556",
      statut: "ACTIVE",
    },
  })

  console.log("[v0] Created sample enterprises")

  // Create sample mission
  const mission = await prisma.mission.create({
    data: {
      reference: "MISS-2024-001",
      type: "INSPECTION_CONTROLE",
      bureau: "Médicaux techniques",
      entrepriseId: hopital.id,
      inspecteurId: inspecteur1.id,
      dateDebut: new Date("2024-10-01"),
      dateFin: new Date("2024-10-05"),
      but: "Inspection de routine pour vérifier la conformité des installations médicales et des procédures de soins.",
      statut: "TERMINEE",
    },
  })

  console.log("[v0] Created sample mission")

  // Create constats
  await prisma.constat.createMany({
    data: [
      {
        missionId: mission.id,
        description: "Équipements médicaux obsolètes dans le service de radiologie",
        categorie: "Équipement",
      },
      {
        missionId: mission.id,
        description: "Manque de personnel qualifié aux urgences",
        categorie: "Personnel",
      },
    ],
  })

  // Create infractions
  await prisma.infraction.createMany({
    data: [
      {
        missionId: mission.id,
        description: "Absence de registre de stérilisation conforme",
        gravite: "GRAVE",
      },
      {
        missionId: mission.id,
        description: "Stockage inadéquat des médicaments",
        gravite: "MOYENNE",
      },
    ],
  })

  // Create actions correctrices
  await prisma.actionCorrectrice.createMany({
    data: [
      {
        missionId: mission.id,
        deficience: "Équipements médicaux obsolètes",
        actionCorrectrice: "Remplacer les équipements de radiologie par des modèles conformes",
        echeance: new Date("2024-12-31"),
        responsableId: inspecteur1.id,
        observations: "Budget alloué pour le remplacement",
        statut: "EN_COURS",
      },
      {
        missionId: mission.id,
        deficience: "Absence de registre de stérilisation",
        actionCorrectrice: "Mettre en place un système de traçabilité de la stérilisation",
        echeance: new Date("2024-11-30"),
        responsableId: inspecteur1.id,
        observations: "Formation du personnel prévue",
        statut: "EN_ATTENTE",
      },
    ],
  })

  console.log("[v0] Created constats, infractions, and actions correctrices")

  // Create notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: inspecteur1.id,
        titre: "Nouvelle mission assignée",
        message: "Vous avez été assigné à la mission MISS-2024-001",
        type: "MISSION_ASSIGNEE",
        lue: true,
      },
      {
        userId: inspecteur1.id,
        titre: "Échéance proche",
        message: "L'action correctrice pour la mission MISS-2024-001 arrive à échéance le 30/11/2024",
        type: "ECHEANCE_PROCHE",
        lue: false,
      },
      {
        userId: admin.id,
        titre: "Nouveau document",
        message: "Un nouveau rapport d'inspection a été ajouté",
        type: "NOUVEAU_DOCUMENT",
        lue: false,
      },
    ],
  })

  console.log("[v0] Created sample notifications")

  console.log("[v0] Database seed completed successfully!")
  console.log("[v0] Login credentials:")
  console.log("[v0]   Email: admin@ips.gov")
  console.log("[v0]   Password: admin123")
}

main()
  .catch((e) => {
    console.error("[v0] Error seeding database:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
