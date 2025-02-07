import { NextResponse } from "next/server"
import prisma from "@/app/dbConfig/dbConfig"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get("token")

  if (!token) {
    return NextResponse.json({ error: "Missing verification token" }, { status: 400 })
  }

  try {
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
      include: { user: true },
    })

    if (!verificationToken) {
      return NextResponse.json({ error: "Invalid verification token" }, { status: 400 })
    }

    if (verificationToken.expires < new Date()) {
      await prisma.verificationToken.delete({
        where: { id: verificationToken.id },
      })
      return NextResponse.json({ error: "Verification token has expired" }, { status: 400 })
    }

    await prisma.user.update({
      where: { id: verificationToken.userId },
      data: { emailVerified: new Date() },
    })

    await prisma.verificationToken.delete({
      where: { id: verificationToken.id },
    })

    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/auth/verify-success`)
  } catch (error) {
    console.error("Verification error:", error)
    return NextResponse.json({ error: "Failed to verify email" }, { status: 500 })
  }
}

