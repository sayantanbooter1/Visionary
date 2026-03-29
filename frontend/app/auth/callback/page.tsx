"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { storeAuthData } from "@/services/authService"
import { toast } from "sonner"

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const token = searchParams.get("token")
    const userParam = searchParams.get("user")

    if (!token || !userParam) {
      toast.error("Authentication failed. Please try again.")
      router.replace("/signup")
      return
    }

    try {
      const user = JSON.parse(decodeURIComponent(userParam))
      storeAuthData(token, user)
      router.replace("/on-boarding")
    } catch {
      toast.error("Failed to process authentication data.")
      router.replace("/signup")
    }
  }, [searchParams, router])

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center animate-pulse">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-gray-600 text-base">Completing sign in...</p>
      </div>
    </div>
  )
}
