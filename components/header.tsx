"use client"

import { useState, Suspense } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"
import { Menu, X, User, LogOut, MessageSquare, History, Settings } from "lucide-react"

function HeaderContent() {
  const { user, logout } = useAuth()
  const { t } = useLanguage()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const navItems = [
    { href: "/chat", label: t("chat"), icon: MessageSquare, authRequired: true },
    { href: "/history", label: t("history"), icon: History, authRequired: true },
    { href: "/settings", label: t("settings"), icon: Settings, authRequired: true },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              UZB AI
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => {
            if (item.authRequired && !user) return null

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary ${
                  pathname === item.href ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>

          {user ? (
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                asChild
              >
                <Link href="/settings">
                  <User className="h-5 w-5" />
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => logout()}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost">{t("login")}</Button>
              </Link>
              <Link href="/register">
                <Button>{t("register")}</Button>
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-muted-foreground hover:text-foreground"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container py-4 space-y-4">
            <nav className="flex flex-col gap-4">
              {navItems.map((item) => {
                if (item.authRequired && !user) return null

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 p-2 rounded-md ${
                      pathname === item.href
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            <div className="flex items-center gap-4">
              <ThemeToggle />
              <LanguageSwitcher />
            </div>

            <div className="flex flex-col gap-2">
              {user ? (
                <>
                  <Link
                    href="/settings"
                    className="flex items-center gap-2 p-2 rounded-md text-muted-foreground hover:text-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="h-5 w-5" />
                    {t("settings")}
                  </Link>
                  <Button
                    variant="ghost"
                    className="justify-start gap-2"
                    onClick={() => {
                      logout()
                      setMobileMenuOpen(false)
                    }}
                  >
                    <LogOut className="h-5 w-5" />
                    {t("logout")}
                  </Button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="flex items-center justify-center p-2 rounded-md text-muted-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t("login")}
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center justify-center p-2 rounded-md bg-primary text-primary-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t("register")}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export function Header() {
  return (
    <Suspense fallback={<div className="h-16 border-b bg-background/95" />}>
      <HeaderContent />
    </Suspense>
  )
}

