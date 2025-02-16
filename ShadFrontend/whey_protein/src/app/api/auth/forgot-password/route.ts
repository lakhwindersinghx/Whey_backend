import { NextResponse } from "next/server"
import prisma from "@/app/dbConfig/dbConfig"
import { sendEmail } from "@/lib/email"
import crypto from "crypto"

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Generate reset token and expiry
    const resetToken = crypto.randomBytes(32).toString("hex")
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour expiry

    // Update user with reset token
    await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    })

    // Create reset URL
    const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`

    // Send password reset email
    await sendEmail(email, "Password Reset", `Click the link to reset your password: <a href="${resetUrl}">${resetUrl}</a>`)

    return NextResponse.json({
      message: "Password reset link sent",
      ...(process.env.NODE_ENV === "development" && { resetToken }),
    })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ error: "Failed to send reset email" }, { status: 500 })
  }
}
