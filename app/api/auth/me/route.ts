import { type NextRequest, NextResponse } from "next/server"
import { mockDb } from "@/lib/mock-db"

export async function GET(request: NextRequest) {
  try {
    console.log("[v0] /api/auth/me called")
    const sessionCookie = request.cookies.get("auth-session")?.value
    console.log("[v0] Session cookie exists:", !!sessionCookie)

    if (!sessionCookie) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const session = JSON.parse(sessionCookie)
    console.log("[v0] Session data:", { userId: session.userId, email: session.email })

    const user = await mockDb.user.findUnique({
      where: { id: session.userId },
    })

    if (!user || !user.actif) {
      console.log("[v0] User not found or inactive")
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 })
    }

    // Don't return password
    const { password: _, ...userWithoutPassword } = user
    console.log("[v0] User found successfully")
    return NextResponse.json({ user: userWithoutPassword })
  } catch (error) {
    console.error("[v0] Auth verification error:", error)
    return NextResponse.json({ error: "Session invalide" }, { status: 401 })
  }
}
