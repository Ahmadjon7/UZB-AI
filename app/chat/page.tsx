"use client"

import { useState, useRef, useEffect, Suspense } from "react"
import { useRouter } from "next/navigation"
import { useChat as useAIChat } from "ai/react"
import { useAuth } from "@/lib/auth-context"
import { useChat } from "@/lib/chat-context"
import { useLanguage } from "@/lib/language-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Send, Trash2, Save } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

function ChatContent() {
  const { user, loading: authLoading } = useAuth()
  const { currentChat, setCurrentChat, saveChat, clearCurrentChat } = useChat()
  const { t } = useLanguage()
  const { toast } = useToast()
  const router = useRouter()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [saveModalOpen, setSaveModalOpen] = useState(false)
  const [chatTitle, setChatTitle] = useState("")

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useAIChat({
    api: "/api/chat",
    initialMessages: currentChat,
    onFinish: () => {
      // Scroll to bottom after message is received
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
      }, 100)
    },
  })

  // Update chat context when messages change
  useEffect(() => {
    setCurrentChat(messages)
  }, [messages, setCurrentChat])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  const handleClearChat = () => {
    clearCurrentChat()
    window.location.reload() // Refresh to clear the AI chat state
  }

  const handleSaveChat = () => {
    if (messages.length === 0) {
      toast({
        title: t("errorOccurred"),
        description: t("cannotSaveEmpty"),
        variant: "destructive",
      })
      return
    }

    saveChat(chatTitle || undefined)
    setSaveModalOpen(false)
    setChatTitle("")

    toast({
      title: t("chatSaved"),
      description: t("chatSavedDesc"),
    })
  }

  if (authLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">{t("loading")}</div>
        </main>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Suspense fallback={<div className="h-16 border-b bg-background/95" />}>
        <Header />
      </Suspense>
      <main className="flex-1 container max-w-4xl py-4 flex flex-col">
        <div className="flex-1 space-y-4 overflow-y-auto pb-20">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <h2 className="text-2xl font-bold mb-2">{t("welcome")}</h2>
              <p className="text-muted-foreground mb-4">
                {t("startConversation")}
              </p>
            </div>
          ) : (
            messages.map((message, index) => (
              <Card
                key={index}
                className={`w-full max-w-3xl ${
                  message.role === "user" ? "ml-auto bg-primary text-primary-foreground" : "mr-auto"
                } scale-in-center`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-2">
                    <div className="text-sm font-medium">{message.role === "user" ? t("you") : "AI"}:</div>
                    <div className="flex-1">{message.content}</div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-sm border-t">
          <div className="container max-w-4xl">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSaveModalOpen(true)}
                disabled={messages.length === 0}
                title={t("saveChat")}
              >
                <Save className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleClearChat}
                disabled={messages.length === 0}
                title={t("clearChat")}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <form onSubmit={handleSubmit} className="flex-1 flex gap-2">
                <Input
                  value={input}
                  onChange={handleInputChange}
                  placeholder={t("typeMessage")}
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button type="submit" disabled={isLoading || input.trim() === ""} className="px-2 sm:px-4">
                  {isLoading ? (
                    <div className="typing-indicator">
                      <span>.</span>
                      <span>.</span>
                      <span>.</span>
                    </div>
                  ) : (
                    <>
                      <Send className="h-4 w-4 sm:mr-2" />
                      <span className="hidden sm:inline">{t("sendMessage")}</span>
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Save Chat Modal */}
        {saveModalOpen && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">{t("saveChat")}</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="chatTitle" className="text-sm font-medium">
                      {t("chatTitle")}
                    </label>
                    <Input
                      id="chatTitle"
                      value={chatTitle}
                      onChange={(e) => setChatTitle(e.target.value)}
                      placeholder={t("enterChatTitle")}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setSaveModalOpen(false)}>
                      {t("cancel")}
                    </Button>
                    <Button onClick={handleSaveChat}>{t("save")}</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">Loading...</div>
        </main>
      </div>
    }>
      <ChatContent />
    </Suspense>
  )
}

