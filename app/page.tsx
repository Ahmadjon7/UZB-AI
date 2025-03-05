"use client"

import Link from "next/link"
import { Suspense, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { useLanguage } from "@/lib/language-context"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

export default function Home() {
  const { t } = useLanguage()
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push('/chat')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Suspense fallback={<div className="h-16 border-b bg-background/95" />}>
          <Header />
        </Suspense>
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">Loading...</div>
        </main>
      </div>
    )
  }

  if (user) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Suspense fallback={<div className="h-16 border-b bg-background/95" />}>
        <Header />
      </Suspense>
      <Suspense fallback={<div className="flex-1 flex items-center justify-center">Loading...</div>}>
        <main className="flex-1">
          <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                    <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                      UZB AI
                    </span>{" "}
                    - {t("welcome")}
                  </h1>
                  <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                    {t("aiAssistantDesc")}
                  </p>
                </div>
                <div className="space-x-4">
                  <Link href="/register">
                    <Button className="scale-in-center">{t("register")}</Button>
                  </Link>
                  <Link href="/login">
                    <Button variant="outline" className="scale-in-center">
                      {t("login")}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
            <div className="container px-4 md:px-6">
              <div className="grid gap-6 lg:grid-cols-3 items-start">
                <div className="rounded-lg border bg-card p-6 shadow-sm fade-in">
                  <div className="flex flex-col space-y-2">
                    <h3 className="text-2xl font-bold">{t("smartConversationsTitle")}</h3>
                    <p className="text-muted-foreground">
                      {t("smartConversationsDesc")}
                    </p>
                  </div>
                </div>
                <div className="rounded-lg border bg-card p-6 shadow-sm fade-in" style={{ animationDelay: "0.2s" }}>
                  <div className="flex flex-col space-y-2">
                    <h3 className="text-2xl font-bold">{t("personalizedExpTitle")}</h3>
                    <p className="text-muted-foreground">
                      {t("personalizedExpDesc")}
                    </p>
                  </div>
                </div>
                <div className="rounded-lg border bg-card p-6 shadow-sm fade-in" style={{ animationDelay: "0.4s" }}>
                  <div className="flex flex-col space-y-2">
                    <h3 className="text-2xl font-bold">{t("multilingualTitle")}</h3>
                    <p className="text-muted-foreground">
                      {t("multilingualDesc")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </Suspense>

      <footer className="border-t">
        <div className="container flex flex-col gap-2 py-6 md:flex-row md:items-center md:justify-between">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            © {new Date().getFullYear()} UZB AI. {t("allRightsReserved")}
          </p>
          <div className="flex justify-center gap-4 md:justify-end">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              {t("terms")}
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              {t("privacy")}
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              {t("contact")}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

