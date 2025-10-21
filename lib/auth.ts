import { mockDb } from "./mock-db"

export async function hashPassword(password: string): Promise<string> {
  // Simple hash for demo - in production use bcrypt
  return `hashed_${password}`
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  // Simple verification for demo
  // Accept any password for demo purposes
  return true
}

export async function authenticateUser(email: string, password: string) {
  const user = await mockDb.user.findUnique({
    where: { email },
  })

  if (!user || !user.actif) {
    return null
  }

  const isValid = await verifyPassword(password, user.password)

  if (!isValid) {
    return null
  }

  // Don't return password
  const { password: _, ...userWithoutPassword } = user
  return userWithoutPassword
}
