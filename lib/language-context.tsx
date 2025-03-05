"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

type Language = "en" | "uz"

type Translations = {
  [key in Language]: {
    [key: string]: string
  }
}

const translations: Translations = {
  en: {
    welcome: "Welcome to UZB AI",
    login: "Login",
    register: "Register",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    name: "Name",
    submit: "Submit",
    chat: "Chat",
    history: "History",
    settings: "Settings",
    logout: "Logout",
    darkMode: "Dark Mode",
    lightMode: "Light Mode",
    language: "Language",
    english: "English",
    uzbek: "Uzbek",
    sendMessage: "Send message",
    typeMessage: "Type your message...",
    clearChat: "Clear chat",
    noHistory: "No chat history yet",
    deleteHistory: "Delete history",
    profile: "Profile",
    updateProfile: "Update Profile",
    passwordUpdated: "Password updated successfully",
    profileUpdated: "Profile updated successfully",
    errorOccurred: "An error occurred",
    required: "This field is required",
    invalidEmail: "Invalid email address",
    passwordLength: "Password must be at least 6 characters",
    passwordsMatch: "Passwords must match",
    smartConversationsTitle: "Smart Conversations",
    smartConversationsDesc: "Engage in natural, intelligent conversations with our AI assistant that understands context and nuance.",
    personalizedExpTitle: "Personalized Experience",
    personalizedExpDesc: "Your conversations are saved, allowing the AI to provide more personalized and relevant responses over time.",
    multilingualTitle: "Multilingual Support",
    multilingualDesc: "Communicate in your preferred language with our AI that supports multiple languages including English and Uzbek.",
    aiAssistantDesc: "Experience the power of artificial intelligence with our advanced AI assistant. Get answers, create content, and solve problems instantly.",
    terms: "Terms",
    privacy: "Privacy",
    contact: "Contact",
    allRightsReserved: "All rights reserved.",
    startConversation: "Start a conversation with the AI assistant by typing a message below.",
    loading: "Loading...",
    you: "You",
    saveChat: "Save Chat",
    chatTitle: "Chat Title (Optional)",
    enterChatTitle: "Enter a title for this chat",
    cancel: "Cancel",
    save: "Save",
    chatSaved: "Chat saved",
    chatSavedDesc: "Your chat has been saved to history",
    cannotSaveEmpty: "Cannot save an empty chat",
  },
  uz: {
    welcome: "UZB AI ga xush kelibsiz",
    login: "Kirish",
    register: "Ro'yxatdan o'tish",
    email: "Elektron pochta",
    password: "Parol",
    confirmPassword: "Parolni tasdiqlang",
    name: "Ism",
    submit: "Yuborish",
    chat: "Chat",
    history: "Tarix",
    settings: "Sozlamalar",
    logout: "Chiqish",
    darkMode: "Qorong'u rejim",
    lightMode: "Yorug' rejim",
    language: "Til",
    english: "Ingliz",
    uzbek: "O'zbek",
    sendMessage: "Xabar yuborish",
    typeMessage: "Xabaringizni yozing...",
    clearChat: "Chatni tozalash",
    noHistory: "Hali chat tarixi yo'q",
    deleteHistory: "Tarixni o'chirish",
    profile: "Profil",
    updateProfile: "Profilni yangilash",
    passwordUpdated: "Parol muvaffaqiyatli yangilandi",
    profileUpdated: "Profil muvaffaqiyatli yangilandi",
    errorOccurred: "Xatolik yuz berdi",
    required: "Bu maydon to'ldirilishi shart",
    invalidEmail: "Noto'g'ri elektron pochta manzili",
    passwordLength: "Parol kamida 6 ta belgidan iborat bo'lishi kerak",
    passwordsMatch: "Parollar mos kelishi kerak",
    smartConversationsTitle: "Aqlli Suhbatlar",
    smartConversationsDesc: "Bizning AI yordamchimiz bilan tabiiy va aqlli suhbatlar quring, u kontekst va ma'noni tushunadi.",
    personalizedExpTitle: "Shaxsiylashtirilgan Tajriba",
    personalizedExpDesc: "Suhbatlaringiz saqlanadi, bu AI ga vaqt o'tishi bilan yanada shaxsiylashtirilgan va tegishli javoblar berishga imkon beradi.",
    multilingualTitle: "Ko'p Tilli Qo'llab-quvvatlash",
    multilingualDesc: "Bizning AI ingliz va o'zbek tillarini qo'llab-quvvatlovchi ko'p tilli yordamchimiz bilan o'zingizga qulay tilda muloqot qiling.",
    aiAssistantDesc: "Bizning rivojlangan AI yordamchimiz bilan sun'iy intellekt imkoniyatlaridan foydalaning. Savollaringizga javob oling, kontent yarating va muammolarni tezda hal qiling.",
    terms: "Shartlar",
    privacy: "Maxfiylik",
    contact: "Aloqa",
    allRightsReserved: "Barcha huquqlar himoyalangan.",
    startConversation: "AI yordamchisi bilan suhbatni boshlash uchun quyida xabar yozing.",
    loading: "Yuklanmoqda...",
    you: "Siz",
    saveChat: "Suhbatni saqlash",
    chatTitle: "Suhbat nomi (Ixtiyoriy)",
    enterChatTitle: "Suhbat uchun nom kiriting",
    cancel: "Bekor qilish",
    save: "Saqlash",
    chatSaved: "Suhbat saqlandi",
    chatSavedDesc: "Suhbatingiz tarixga saqlandi",
    cannotSaveEmpty: "Bo'sh suhbatni saqlab bo'lmaydi",
  },
}

type LanguageContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "uz")) {
      setLanguageState(savedLanguage)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("language", lang)
  }

  const t = (key: string) => {
    return translations[language][key] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

