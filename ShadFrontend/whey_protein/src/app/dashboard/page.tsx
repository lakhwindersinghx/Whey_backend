import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import ClientPage from "./client"

export default async function Page() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/sign-in")
  }

  return <ClientPage />
}

