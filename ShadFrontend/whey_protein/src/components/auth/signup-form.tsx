"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

interface SignUpFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SignUpForm({ className, ...props }: SignUpFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const email = formData.get("email") as string
    const username = formData.get("username") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    if (password !== confirmPassword) {
      toast.error("Passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      const res = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          username,
          password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong")
      }

      toast.success("Verification email sent!")
      router.push("/auth/verify-pending")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("grid gap-6" , className)} {...props}>
      <div className="flex flex-col items-center space-y-2 text-center">
        {/* <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-background">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
          >
            <rect width="20" height="14" x="2" y="5" rx="2" />
            <line x1="2" x2="22" y1="10" y2="10" />
          </svg>
        </div> */}
        <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
      </div>
      <Card className="border-0 bg-[#ffffff]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Sign up</CardTitle>
          <CardDescription className="text-center">Enter your details below to create your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  placeholder="m@example.com"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  disabled={isLoading}
                  // className="bg-[#ffffff] border-gray-700"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  placeholder="johndoe"
                  type="text"
                  autoCapitalize="none"
                  autoComplete="username"
                  disabled={isLoading}
                  // className="bg-[#1C1C1C] border-gray-700"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  disabled={isLoading}
                  // className="bg-[#1C1C1C] border-gray-700"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  disabled={isLoading}
                  // className="bg-[#1C1C1C] border-gray-700"
                  required
                />
              </div>
              <Button disabled={isLoading}>{isLoading ? "Creating account..." : "Create account"}</Button>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <a href="/auth/sign-in" className="underline underline-offset-4 hover:text-primary">
                  Sign in
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-center text-sm text-muted-foreground">
        By clicking continue, you agree to our{" "}
        <a href="#" className="underline underline-offset-4 hover:text-primary">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="underline underline-offset-4 hover:text-primary">
          Privacy Policy
        </a>
        .
      </div>
    </div>
  )
}

