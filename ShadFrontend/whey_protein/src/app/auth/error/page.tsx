"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AuthError() {
  const searchParams = useSearchParams()
  const error = searchParams?.get("error") ?? "Unknown error"

  useEffect(() => {
    if (error) {
      console.error("Authentication error:", error)
    }
  }, [error])

  return (
    <div className="h-screen bg-black">
      <div className="container flex h-screen w-screen flex-col items-center justify-center">
        <Card className="mx-auto w-full max-w-md border-0 bg-[#1C1C1C]">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Authentication Error</CardTitle>
            <CardDescription className="text-center">
              {error === "CredentialsSignin" ? "Invalid email or password" : "There was an error signing in"}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Button asChild>
              <Link href="/auth/sign-in">Try Again</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Go Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

