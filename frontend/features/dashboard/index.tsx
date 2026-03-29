"use client"

import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Welcome Card */}
      <div className="bg-white rounded-3xl border border-gray-200 p-12 flex flex-col items-center">
        <img src="/logo.png" alt="Logo" className="w-20 h-20 mb-6" />
        <h1 className="text-3xl font-medium text-gray-900 text-center">
          Welcome to Visionary, Prateek
        </h1>
      </div>

      {/* Start Learning Card */}
      <div className="bg-white rounded-3xl border border-gray-200 p-12">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-medium text-gray-900">
            Start your first lesson
          </h2>
          <p className="text-gray-600 text-base">
            Start exploring study material on Visionary as per your needs & preference
          </p>
          <Button className="w-full max-w-md bg-blue-600 hover:bg-blue-700 text-white rounded-full h-14 text-base font-medium">
            Start Learning
          </Button>
        </div>
      </div>
    </div>
  )
}