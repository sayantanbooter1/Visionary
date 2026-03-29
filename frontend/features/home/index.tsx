"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    router.push("/signup")
  }, [router])

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold">Home</h1>
      <p>Welcome to your app</p>
      <Link href="/about">
        <Button>Go to About</Button>
      </Link>
    </div>
  )
}