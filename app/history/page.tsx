"use client"

import { useEffect, Suspense } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useChat } from "@/lib/chat-context"
import { useLanguage } from "@/lib/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Trash2 } from "lucide-react"
import { formatDate } from "@/lib/utils"

function HistoryContent() {
  const { user, loading: authLoading } = useAuth()
  const { chatHistory, loadChat, deleteChat } = useChat()
  const { t } = useLanguage()
  const router = useRouter()

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  const handleLoadChat = (id: string) => {
    loadChat(id)
    router.push("/chat")
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
        <h1 className="text-3xl font-bold mb-6">{t("history")}</h1>
        <div className="grid gap-4">
          {chatHistory.length === 0 ? (
            <Card>
              <CardContent className="py-8">
                <p className="text-center text-muted-foreground">{t("noChats")}</p>
              </CardContent>
            </Card>
          ) : (
            chatHistory.map((chat) => (
              <Card key={chat.id} className="relative">
                <CardHeader>
                  <CardTitle className="text-xl">{chat.title || t("untitledChat")}</CardTitle>
                  <CardDescription>{formatDate(chat.createdAt)}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-2 text-muted-foreground">
                    {chat.messages[0]?.content || t("noMessages")}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => handleLoadChat(chat.id)}>
                    {t("openChat")}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteChat(chat.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  )
}

export default function HistoryPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">Loading...</div>
        </main>
      </div>
    }>
      <HistoryContent />
    </Suspense>
  )
}

