import NextAuth from "next-auth"
import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import prisma from "@/app/dbConfig/dbConfig"

// Validate environment variables
const validateEnv = () => {
  const requiredEnvVars = ["NEXTAUTH_URL", "NEXTAUTH_SECRET", "DATABASE_URL"] as const
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`${envVar} environment variable is not set`)
    }
  }
}

// Call validation immediately
validateEnv()

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter both email and password")
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          })

          if (!user) {
            throw new Error("No user found with this email")
          }

          if (!user.emailVerified) {
            throw new Error("Please verify your email before signing in")
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

          if (!isPasswordValid) {
            throw new Error("Invalid password")
          }

          return {
            id: user.id,
            email: user.email,
            name: user.username,
          }
        } catch (error) {
          console.error("Auth error:", error)
          throw new Error(error instanceof Error ? error.message : "Authentication failed")
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/sign-in",
    error: "/auth/error",
    verifyRequest: "/auth/verify-pending",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  debug: process.env.NODE_ENV === "development",
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }

