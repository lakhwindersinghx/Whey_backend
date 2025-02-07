import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle } from "lucide-react"

export default function VerifySuccess() {
  return (
    <div className="h-screen bg-black">
      <div className="container flex h-screen w-screen flex-col items-center justify-center">
        <Card className="mx-auto w-full max-w-md border-0 bg-[#1C1C1C]">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <CardTitle className="text-2xl text-center">Email Verified</CardTitle>
            <CardDescription className="text-center">
              Your email has been successfully verified. You can now sign in to your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Button asChild>
              <Link href="/auth/sign-in">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

