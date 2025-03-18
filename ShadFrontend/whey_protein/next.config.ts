// import type { NextConfig } from "next";
// import dotenv from "dotenv";

// dotenv.config(); // Ensure environment variables are loaded

// const nextConfig = {
//   env: {
//     NEXTAUTH_URL: process.env.NEXTAUTH_URL,
//     NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
//     DATABASE_URL: process.env.DATABASE_URL,
//     GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
//     GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
//   },
// }

// export default nextConfig;
//following code ignores eslint errors
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    // This will ignore ESLint errors during builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // This will ignore TypeScript errors during builds
    ignoreBuildErrors: true,
  },
}

export default nextConfig

