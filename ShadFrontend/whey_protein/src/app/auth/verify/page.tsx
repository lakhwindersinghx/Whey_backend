// import { redirect } from "next/navigation"
// import { Loader2 } from "lucide-react"

// export default function VerifyPage({
//   searchParams,
// }: {
//   searchParams: { token?: string }
// }) {
//   if (!searchParams.token) {
//     redirect("/auth/error?error=missing-token")
//   }

//   // Automatically submit the token for verification
//   redirect(`/api/auth/verify?token=${searchParams.token}`)

//   // This part won't be reached, but we'll show a loading state just in case
//   return (
//     <div className="h-screen bg-black flex items-center justify-center">
//       <div className="flex flex-col items-center gap-4">
//         <Loader2 className="h-8 w-8 animate-spin text-white" />
//         <p className="text-white">Verifying your email...</p>
//       </div>
//     </div>
//   )
// }

import { redirect } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function VerifyPage({
  searchParams,
}: {
  searchParams: { token?: string }
}) {
  // Log the token for debugging
  console.log(
    "DEBUG: Verify page loaded with token:",
    searchParams.token ? searchParams.token.substring(0, 10) + "..." : "none",
  )

  if (!searchParams.token) {
    console.log("DEBUG: Missing token, redirecting to error page")
    redirect("/auth/error?error=missing-token")
  }

  // Automatically submit the token for verification
  console.log("DEBUG: Redirecting to API route")
  redirect(`/api/auth/verify?token=${encodeURIComponent(searchParams.token)}`)

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

