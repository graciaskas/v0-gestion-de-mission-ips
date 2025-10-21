// Mock database for development - simulates Prisma in browser environment
type UserRole = "ADMIN" | "CHEF_SERVICE" | "INSPECTEUR" | "ARCHIVISTE"
type StatutMission = "PLANIFIEE" | "EN_COURS" | "TERMINEE" | "ANNULEE"
type TypeMission = "INSPECTION_CONTROLE" | "ENCADREMENT" | "AUDIT" | "ENQUETE"
type TypeNotification = "MISSION_ASSIGNEE" | "ECHEANCE_PROCHE" | "ACTION_RETARD" | "NOUVEAU_DOCUMENT" | "SYSTEME"

interface User {
  id: string
  email: string
  nom: string
  prenom: string
  password: string
  role: UserRole
  bureau?: string
  telephone?: string
  actif: boolean
  createdAt: Date
  updatedAt: Date
}

interface Notification {
  id: string
  userId: string
  titre: string
  message: string
  type: TypeNotification
  lue: boolean
  createdAt: Date
}

// In-memory storage
const users: User[] = [
  {
    id: "1",
    email: "admin@ips.gov",
    nom: "Admin",
    prenom: "Principal",
    password: "hashed_admin123",
    role: "ADMIN",
    actif: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    email: "inspecteur@ips.gov",
    nom: "Dupont",
    prenom: "Jean",
    password: "hashed_inspecteur123",
    role: "INSPECTEUR",
    bureau: "Médicaux techniques",
    telephone: "+243 123 456 789",
    actif: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    email: "chef@ips.gov",
    nom: "Martin",
    prenom: "Marie",
    password: "hashed_chef123",
    role: "CHEF_SERVICE",
    bureau: "Hygiène",
    telephone: "+243 987 654 321",
    actif: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

const notifications: Notification[] = [
  {
    id: "1",
    userId: "2",
    titre: "Nouvelle mission assignée",
    message: "Vous avez été assigné à la mission MISS-2024-001",
    type: "MISSION_ASSIGNEE",
    lue: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: "2",
    userId: "2",
    titre: "Échéance proche",
    message: "L'action correctrice pour la mission MISS-2024-001 arrive à échéance le 30/11/2024",
    type: "ECHEANCE_PROCHE",
    lue: false,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
  {
    id: "3",
    userId: "1",
    titre: "Nouveau document",
    message: "Un nouveau rapport d'inspection a été ajouté",
    type: "NOUVEAU_DOCUMENT",
    lue: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
  },
]

export const mockDb = {
  user: {
    findUnique: async ({ where }: { where: { email?: string; id?: string } }) => {
      if (where.email) {
        return users.find((u) => u.email === where.email) || null
      }
      if (where.id) {
        return users.find((u) => u.id === where.id) || null
      }
      return null
    },
    findMany: async () => {
      return users
    },
  },
  notification: {
    findMany: async ({ where, orderBy, take }: any) => {
      let filtered = notifications
      if (where?.userId) {
        filtered = filtered.filter((n) => n.userId === where.userId)
      }
      if (orderBy?.createdAt === "desc") {
        filtered = [...filtered].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      }
      if (take) {
        filtered = filtered.slice(0, take)
      }
      return filtered
    },
    create: async ({ data }: any) => {
      const notification: Notification = {
        id: String(notifications.length + 1),
        ...data,
        createdAt: new Date(),
      }
      notifications.push(notification)
      return notification
    },
    update: async ({ where, data }: any) => {
      const index = notifications.findIndex((n) => n.id === where.id)
      if (index !== -1) {
        notifications[index] = { ...notifications[index], ...data }
        return notifications[index]
      }
      return null
    },
    updateMany: async ({ where, data }: any) => {
      let count = 0
      notifications.forEach((n, index) => {
        if (where.userId && n.userId === where.userId && where.lue === false && !n.lue) {
          notifications[index] = { ...n, ...data }
          count++
        }
      })
      return { count }
    },
  },
}
