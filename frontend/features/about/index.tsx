import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold">About</h1>
      <p>This is the about page</p>
      <Link href="/">
        <Button>Back to Home</Button>
      </Link>
    </div>
  )
}