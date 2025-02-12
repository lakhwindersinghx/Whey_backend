import { redirect } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function VerifyPage({
  searchParams,
}: {
  searchParams: { token?: string }
}) {
  if (!searchParams.token) {
    redirect("/auth/error?error=missing-token")
  }

  // Automatically submit the token for verification
  redirect(`/api/auth/verify?token=${searchParams.token}`)

  // This part won't be reached, but we'll show a loading state just in case
  return (
    <div className="h-screen bg-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
        <p className="text-white">Verifying your email...</p>
      </div>
    </div>
  )
}

