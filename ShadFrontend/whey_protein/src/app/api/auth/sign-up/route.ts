import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import prisma from "@/app/dbConfig/dbConfig";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { email, username, password } = await req.json();

    if (!email || !username || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: existingUser.email === email ? "Email already in use" : "Username already taken" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user and verification token in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          username,
          password: hashedPassword,
        },
      });

      const token = nanoid(32);
      const verificationToken = await tx.verificationToken.create({
        data: {
          token,
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });

      return { user, token: verificationToken.token };
    });

    // Send verification email
    await sendVerificationEmail(result.user.email, result.token);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
  }
}
