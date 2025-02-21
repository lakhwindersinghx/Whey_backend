import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import type { User } from "next-auth";

export type AuthUser = User & {
  id: string;
};

// Ensure `getSession` is exported
export async function getSession() {
  return await getServerSession(authOptions);
}

// Ensure `getCurrentUser` is exported
export async function getCurrentUser() {
  const session = await getSession();
  return session?.user ?? null;
}
