import { type NextRequest, NextResponse } from "next/server"
import { authenticateUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Login route called")
    const body = await request.json()
    console.log("[v0] Login request body:", { email: body.email })

    const { email, password } = body

    if (!email || !password) {
      console.log("[v0] Missing email or password")
      return NextResponse.json({ error: "Email et mot de passe requis" }, { status: 400 })
    }

    const user = await authenticateUser(email, password)
    console.log("[v0] Authentication result:", user ? "success" : "failed")

    if (!user) {
      return NextResponse.json({ error: "Email ou mot de passe incorrect" }, { status: 401 })
    }

    const response = NextResponse.json({ user })

    // Set simple session cookie
    response.cookies.set(
      "auth-session",
      JSON.stringify({
        userId: user.id,
        email: user.email,
        role: user.role,
        nom: user.nom,
        prenom: user.prenom,
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      },
    )

    console.log("[v0] Login successful, cookie set")
    return response
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json({ error: "Erreur lors de la connexion" }, { status: 500 })
  }
}
