// import NextAuth from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import type { NextAuthOptions } from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import bcrypt from "bcryptjs";
// import prisma from "@/app/dbConfig/dbConfig";

// // Ensure environment variables are loaded correctly
// // console.log("from route.ts: NEXTAUTH_URL:", process.env.NEXTAUTH_URL);

// // Check required environment variables
// const validateEnv = () => {
//   const requiredEnvVars = ["NEXTAUTH_URL", "NEXTAUTH_SECRET", "DATABASE_URL"]
//   // console.log(process.env.NEXTAUTH_URL);
//   for (const envVar of requiredEnvVars) {
//     if (!process.env[envVar]) {
//       throw new Error(`ERROR: ${envVar} environment variable is not set`);
//     }
//   }
// };
// console.log("DEBUG NEXTAUTH_URL:", process.env.NEXTAUTH_URL);

// // console.log(process.env.NEXTAUTH_URL)
// // Call validation immediately
// validateEnv();

// export const authOptions: NextAuthOptions = {
//   providers: [
//     CredentialsProvider({
//       name: "credentials",
//       credentials: {
//         email: { label: "Email", type: "text" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) {
//           throw new Error("Please enter both email and password");
//         }

//         try {
//           const user = await prisma.user.findUnique({
//             where: { email: credentials.email },
//           });

//           if (!user) {
//             throw new Error("No user found with this email");
//           }

//           if (!user.emailVerified) {
//             throw new Error("Please verify your email before signing in");
//           }

//           const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

//           if (!isPasswordValid) {
//             throw new Error("Invalid password");
//           }

//           return {
//             id: user.id,
//             email: user.email,
//             name: user.username,
//           };
//         } catch (error) {
//           console.error("Auth error:", error);
//           throw new Error(error instanceof Error ? error.message : "Authentication failed");
//         }
//       },
//     }),
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),
//   ],
//   pages: {
//     signIn: "/auth/sign-in",
//     error: "/auth/error",
//     verifyRequest: "/auth/verify-pending",
//   },
//   session: {
//     strategy: "jwt",
//     maxAge: 30 * 24 * 60 * 60, // 30 days
//   },
//   callbacks: {
//     async redirect({ url, baseUrl }) {
//       // console.log("Redirecting from:", url, "to:", baseUrl + "/dashboard");
//       return baseUrl + "/dashboard"; // Ensure users go to /dashboard after login
//     },
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (session.user) {
//         session.user.id = token.id as string;
//       }
//       return session;
//     },
//   },
//   debug: process.env.NODE_ENV === "development",
// };

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import prisma from "@/app/dbConfig/dbConfig"

// Fix for malformed URL
const sanitizeUrl = (url: string | undefined): string | undefined => {
  if (!url) return undefined

  // Remove any leading/trailing whitespace
  let sanitized = url.trim()

  // Fix double https:// issue
  if (sanitized.startsWith("https:// https://")) {
    sanitized = sanitized.replace("https:// https://", "https://")
  }

  // Ensure URL is valid
  try {
    new URL(sanitized)
    return sanitized
  } catch (e) {
    console.error("Invalid URL:", url, "Error:", e)
    // Return a fallback or undefined
    return undefined
  }
}

// Sanitize NEXTAUTH_URL
const NEXTAUTH_URL = sanitizeUrl(process.env.NEXTAUTH_URL)
console.log("DEBUG NEXTAUTH_URL (sanitized):", NEXTAUTH_URL)

// Ensure environment variables are loaded correctly
const validateEnv = () => {
  const requiredEnvVars = ["NEXTAUTH_SECRET", "DATABASE_URL"]
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`ERROR: ${envVar} environment variable is not set`)
    }
  }

  // Validate NEXTAUTH_URL separately since we've sanitized it
  if (!NEXTAUTH_URL) {
    throw new Error("ERROR: NEXTAUTH_URL is invalid or not set")
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
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
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
    async redirect({ url, baseUrl }) {
      return baseUrl + "/dashboard" // Ensure users go to /dashboard after login
    },
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
  // Use our sanitized URL
  ...(NEXTAUTH_URL && { url: NEXTAUTH_URL }),
  debug: process.env.NODE_ENV === "development",
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }

