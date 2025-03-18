"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"

export default function VerifyPending() {
  return (
    <div className="h-screen bg-black">
      <div className="container flex h-screen w-screen flex-col items-center justify-center">
        <Card className="mx-auto w-full max-w-md border-0 bg-[#1C1C1C]">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <Mail className="h-12 w-12 text-blue-500" />
            </div>
            <CardTitle className="text-2xl text-center">Check Your Email</CardTitle>
            <CardDescription className="text-center">
              We&apos;ve sent you a verification link. Please check your email and click the link to verify your
              account.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Button variant="outline" asChild onClick={() => window.location.reload()}>
              <span>Refresh Page</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

