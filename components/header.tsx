"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"
import { Menu, X, User, LogOut, MessageSquare, History, Settings } from "lucide-react"

export function Header() {
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
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LanguageSwitcher />

          {user ? (
            <div className="hidden md:flex items-center gap-2">
              <Link href="/settings">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
              <Button variant="ghost" size="icon" onClick={logout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost">{t("login")}</Button>
              </Link>
              <Link href="/register">
                <Button>{t("register")}</Button>
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMobileMenu}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="container py-4 space-y-4">
            {navItems.map((item) => {
              if (item.authRequired && !user) return null

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 p-2 rounded-md ${
                    pathname === item.href ? "bg-muted text-primary" : "text-muted-foreground"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              )
            })}

            {user ? (
              <>
                <Link
                  href="/settings"
                  className="flex items-center gap-2 p-2 rounded-md text-muted-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="h-5 w-5" />
                  {t("profile")}
                </Link>
                <button
                  className="flex items-center gap-2 p-2 rounded-md text-muted-foreground w-full text-left"
                  onClick={() => {
                    logout()
                    setMobileMenuOpen(false)
                  }}
                >
                  <LogOut className="h-5 w-5" />
                  {t("logout")}
                </button>
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
      )}
    </header>
  )
}

