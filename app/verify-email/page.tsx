"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"

export default function VerifyEmailPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // If user is already verified, redirect to chat
    if (user?.emailVerified) {
      router.push("/chat")
    }
  }, [user, router])

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Check Your Email</CardTitle>
            <CardDescription className="text-center">
              We&apos;ve sent you an email with a verification link. Please check your inbox and click the link to verify
              your email address.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center text-sm text-muted-foreground">
              <p>Once you verify your email, you&apos;ll be able to log in and start using the application.</p>
              <p className="mt-2">
                If you don&apos;t see the email, please check your spam folder or{" "}
                <button
                  onClick={() => window.location.reload()}
                  className="text-primary hover:underline"
                >
                  click here to try again
                </button>
                .
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
} 