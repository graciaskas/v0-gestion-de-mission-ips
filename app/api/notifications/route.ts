import { type NextRequest, NextResponse } from "next/server"
import { mockDb } from "@/lib/mock-db"
import { jwtVerify } from "jose"
import { cookies } from "next/headers"

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-change-in-production")

async function getUserFromToken(request: NextRequest) {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")?.value

  if (!token) {
    return null
  }

  try {
    const { payload } = await jwtVerify(token, secret)
    return payload.userId as string
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  const userId = await getUserFromToken(request)

  if (!userId) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
  }

  const notifications = await mockDb.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 50,
  })

  return NextResponse.json({ notifications })
}

export async function POST(request: NextRequest) {
  const userId = await getUserFromToken(request)

  if (!userId) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
  }

  const { titre, message, type, targetUserId } = await request.json()

  const notification = await mockDb.notification.create({
    data: {
      userId: targetUserId || userId,
      titre,
      message,
      type,
      lue: false,
    },
  })

  return NextResponse.json({ notification })
}

export async function PATCH(request: NextRequest) {
  const userId = await getUserFromToken(request)

  if (!userId) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
  }

  const { notificationId } = await request.json()

  const notification = await mockDb.notification.update({
    where: { id: notificationId },
    data: { lue: true },
  })

  return NextResponse.json({ notification })
}
