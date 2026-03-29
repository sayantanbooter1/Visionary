"use client"

import { useState } from "react"
import Header from "@/features/dashboard/components/Header"
import Sidebar from "@/features/dashboard/components/Sidebar"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main Content */}
      <main className="pt-16 pl-0 lg:pl-20">
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
