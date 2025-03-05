"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

type User = {
  id: string
  name: string
  email: string
  emailVerified: boolean
}

type AuthError = {
  message: string
  code: string
}

type AuthContextType = {
  user: User | null
  loading: boolean
  error: AuthError | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  updateProfile: (name: string) => Promise<void>
  updatePassword: (password: string) => Promise<void>
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<AuthError | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata.name || '',
          emailVerified: session.user.email_confirmed_at != null,
        })
      }
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata.name || '',
          emailVerified: session.user.email_confirmed_at != null,
        })

        // If email is verified and we're on the verification page, redirect to chat
        if (session.user.email_confirmed_at && window.location.pathname === '/verify-email') {
          router.push('/chat')
        }
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [router])

  const clearError = () => setError(null)

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      clearError()

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Check if email is verified
      if (!data.user?.email_confirmed_at) {
        throw {
          message: "Please verify your email before logging in. Check your inbox for a verification link.",
          code: "auth/email-not-verified"
        }
      }

      router.push("/chat")
    } catch (err: any) {
      setError({
        message: err.message,
        code: err.code,
      })
      throw err
    } finally {
      setLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true)
      clearError()

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error

      // Show success message and redirect to verification page
      router.push("/verify-email")
    } catch (err: any) {
      setError({
        message: err.message,
        code: err.code,
      })
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await supabase.auth.signOut()
      router.push("/")
    } catch (err: any) {
      setError({
        message: err.message,
        code: err.code,
      })
    }
  }

  const updateProfile = async (name: string) => {
    if (!user) return

    try {
      setLoading(true)
      clearError()

      const { error } = await supabase.auth.updateUser({
        data: { name },
      })

      if (error) throw error

      setUser((prev) => prev ? { ...prev, name } : null)
    } catch (err: any) {
      setError({
        message: err.message,
        code: err.code,
      })
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updatePassword = async (password: string) => {
    try {
      setLoading(true)
      clearError()

      const { error } = await supabase.auth.updateUser({
        password,
      })

      if (error) throw error
    } catch (err: any) {
      setError({
        message: err.message,
        code: err.code,
      })
      throw err
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        updateProfile,
        updatePassword,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

