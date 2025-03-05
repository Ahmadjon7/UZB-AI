"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ThemeProvider } from "next-themes"
import { LanguageProvider } from "@/lib/language-context"
import { AuthProvider } from "@/lib/auth-context"
import { ChatProvider } from "@/lib/chat-context"

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <LanguageProvider>
          <AuthProvider>
            <ChatProvider>{children}</ChatProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <LanguageProvider>
        <AuthProvider>
          <ChatProvider>{children}</ChatProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}

