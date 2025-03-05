import Link from "next/link"
import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import ClientHomeContent from "@/components/client-home"

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col min-h-screen">
        <div className="h-16 border-b bg-background/95" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    }>
      <ClientHomeContent />
    </Suspense>
  )
}

