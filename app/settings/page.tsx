"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { useToast } from "@/components/ui/use-toast"
import { Moon, Sun, Globe } from "lucide-react"

function SettingsContent() {
  const { user, loading: authLoading, updateProfile, updatePassword } = useAuth()
  const { t, language, setLanguage } = useLanguage()
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()
  const router = useRouter()

  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [profileLoading, setProfileLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    } else if (user) {
      setName(user.name)
    }
  }, [user, authLoading, router])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast({
        title: t("errorOccurred"),
        description: "Name cannot be empty",
        variant: "destructive",
      })
      return
    }

    setProfileLoading(true)

    try {
      await updateProfile(name)
      toast({
        title: t("profileUpdated"),
      })
    } catch (error) {
      toast({
        title: t("errorOccurred"),
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive",
      })
    } finally {
      setProfileLoading(false)
    }
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password.length < 6) {
      toast({
        title: t("errorOccurred"),
        description: t("passwordLength"),
        variant: "destructive",
      })
      return
    }

    if (password !== confirmPassword) {
      toast({
        title: t("errorOccurred"),
        description: t("passwordsMatch"),
        variant: "destructive",
      })
      return
    }

    setPasswordLoading(true)

    try {
      await updatePassword(password)
      setPassword("")
      setConfirmPassword("")
      toast({
        title: t("passwordUpdated"),
      })
    } catch (error) {
      toast({
        title: t("errorOccurred"),
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive",
      })
    } finally {
      setPasswordLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">Loading...</div>
        </main>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container max-w-4xl py-8">
        <h1 className="text-3xl font-bold mb-6">{t("settings")}</h1>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>{t("profile")}</CardTitle>
              <CardDescription>Update your profile information</CardDescription>
            </CardHeader>
            <form onSubmit={handleUpdateProfile}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    {t("name")}
                  </label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} disabled={profileLoading} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("email")}</label>
                  <Input value={user.email} disabled className="bg-muted" />
                  <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={profileLoading}>
                  {profileLoading ? "Updating..." : t("updateProfile")}
                </Button>
              </CardFooter>
            </form>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your password</CardDescription>
            </CardHeader>
            <form onSubmit={handleUpdatePassword}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    {t("password")}
                  </label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={passwordLoading}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium">
                    {t("confirmPassword")}
                  </label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={passwordLoading}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={passwordLoading}>
                  {passwordLoading ? "Updating..." : "Update Password"}
                </Button>
              </CardFooter>
            </form>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize the appearance of the application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Theme</label>
                <div className="flex gap-2">
                  <Button
                    variant={theme === "light" ? "default" : "outline"}
                    className="flex-1"
                    onClick={() => setTheme("light")}
                  >
                    <Sun className="h-4 w-4 mr-2" />
                    {t("lightMode")}
                  </Button>
                  <Button
                    variant={theme === "dark" ? "default" : "outline"}
                    className="flex-1"
                    onClick={() => setTheme("dark")}
                  >
                    <Moon className="h-4 w-4 mr-2" />
                    {t("darkMode")}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Language</CardTitle>
              <CardDescription>Change the language of the application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("language")}</label>
                <div className="flex gap-2">
                  <Button
                    variant={language === "en" ? "default" : "outline"}
                    className="flex-1"
                    onClick={() => setLanguage("en")}
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    {t("english")}
                  </Button>
                  <Button
                    variant={language === "uz" ? "default" : "outline"}
                    className="flex-1"
                    onClick={() => setLanguage("uz")}
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    {t("uzbek")}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default function SettingsPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">Loading...</div>
        </main>
      </div>
    }>
      <SettingsContent />
    </Suspense>
  )
}

