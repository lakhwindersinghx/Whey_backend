"use client"

import Link from "next/link"
import { signOut, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"

export function Nav() {
  const { data: session } = useSession()

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center">
              Logo
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/" className="px-3 py-2 rounded-md text-sm font-medium">
                Home
              </Link>
              {session && (
                <Link href="/dashboard" className="px-3 py-2 rounded-md text-sm font-medium">
                  Dashboard
                </Link>
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {session ? (
              <Button onClick={() => signOut()} variant="ghost">
                Sign out
              </Button>
            ) : (
              <Link href="/auth/sign-in" className="text-sm font-medium">
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

