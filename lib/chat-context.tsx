"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import type { Message } from "ai"

type ChatHistory = {
  id: string
  title: string
  messages: Message[]
  createdAt: string
}

type ChatContextType = {
  currentChat: Message[]
  setCurrentChat: (messages: Message[]) => void
  chatHistory: ChatHistory[]
  saveChat: (title?: string) => void
  loadChat: (id: string) => void
  deleteChat: (id: string) => void
  clearCurrentChat: () => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

const CHAT_HISTORY_KEY = "uzb_ai_chat_history"

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [currentChat, setCurrentChat] = useState<Message[]>([])
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([])

  // Load chat history when user changes
  useEffect(() => {
    if (user && typeof window !== "undefined") {
      const storedHistory = localStorage.getItem(`${CHAT_HISTORY_KEY}_${user.id}`)
      if (storedHistory) {
        setChatHistory(JSON.parse(storedHistory))
      } else {
        setChatHistory([])
      }
    } else {
      setChatHistory([])
    }
  }, [user])

  const saveChat = (title?: string) => {
    if (!user || currentChat.length === 0) return

    // Generate a title if not provided
    const chatTitle = title || currentChat[0]?.content.substring(0, 30) + "..." || "New Chat"

    const newChat: ChatHistory = {
      id: Date.now().toString(),
      title: chatTitle,
      messages: currentChat,
      createdAt: new Date().toISOString(),
    }

    const updatedHistory = [newChat, ...chatHistory]
    setChatHistory(updatedHistory)
    localStorage.setItem(`${CHAT_HISTORY_KEY}_${user.id}`, JSON.stringify(updatedHistory))
  }

  const loadChat = (id: string) => {
    const chat = chatHistory.find((c) => c.id === id)
    if (chat) {
      setCurrentChat(chat.messages)
    }
  }

  const deleteChat = (id: string) => {
    if (!user) return

    const updatedHistory = chatHistory.filter((c) => c.id !== id)
    setChatHistory(updatedHistory)
    localStorage.setItem(`${CHAT_HISTORY_KEY}_${user.id}`, JSON.stringify(updatedHistory))
  }

  const clearCurrentChat = () => {
    setCurrentChat([])
  }

  return (
    <ChatContext.Provider
      value={{
        currentChat,
        setCurrentChat,
        chatHistory,
        saveChat,
        loadChat,
        deleteChat,
        clearCurrentChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider")
  }
  return context
}

