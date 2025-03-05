import type React from "react"
import "./globals.css"
import { Providers } from "@/components/providers"
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from "@/components/analytics"

export const metadata = {
  title: "UZB AI - Your Intelligent Assistant",
  description: "An AI-powered assistant that helps you with your daily tasks",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans">
        <Providers>
          {children}
          <Toaster />
          <Analytics />
        </Providers>
      </body>
    </html>
  )
}