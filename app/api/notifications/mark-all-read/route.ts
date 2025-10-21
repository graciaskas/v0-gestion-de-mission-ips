import { type NextRequest, NextResponse } from "next/server"
import { mockDb } from "@/lib/mock-db"
import { jwtVerify } from "jose"
import { cookies } from "next/headers"

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-change-in-production")

export async function POST(request: NextRequest) {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")?.value

  if (!token) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
  }

  try {
    const { payload } = await jwtVerify(token, secret)
    const userId = payload.userId as string

    await mockDb.notification.updateMany({
      where: { userId, lue: false },
      data: { lue: true },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Erreur" }, { status: 500 })
  }
}
