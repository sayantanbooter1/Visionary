"use client"

import { Search, Globe, Bell, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface HeaderProps {
  onMenuClick?: () => void
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50">
      <div className="flex items-center justify-between h-full px-6">
        {/* Left Section - Menu and Logo */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <Menu className="w-6 h-6" />
          </Button>
          
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Visionary Logo" className="w-8 h-8" />
            <span className="text-xl font-medium text-gray-700">Visionary</span>
          </div>
        </div>

        {/* Center Section - Search Bar */}
        <div className="flex-1 max-w-2xl mx-8">
          <div className="relative">
            <Input
              type="text"
              placeholder="What do you want to learn today?"
              className="w-full h-10 pl-4 pr-10 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-0"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-10 w-10"
            >
              <Search className="w-5 h-5 text-gray-500" />
            </Button>
          </div>
        </div>

        {/* Right Section - Language, Notifications, Profile */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="gap-2">
            <Globe className="w-5 h-5" />
            <span>ENG</span>
          </Button>

          <Button variant="ghost" size="icon">
            <Bell className="w-5 h-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10 rounded-full bg-gray-400"
          >
            <span className="sr-only">Profile</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
