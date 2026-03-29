"use client"

import { LayoutDashboard, BookOpen, MessageCircleQuestion, Dumbbell } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

const menuItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    icon: BookOpen,
    label: "Learn",
    href: "/dashboard/learn",
  },
  {
    icon: MessageCircleQuestion,
    label: "Ask",
    href: "/dashboard/ask",
  },
  {
    icon: Dumbbell,
    label: "Practice",
    href: "/dashboard/practice",
  },
]

export default function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-16 h-[calc(100vh-4rem)] w-20 bg-white border-r border-gray-200 z-40 transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <nav className="flex flex-col items-center py-8 gap-8">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-2 w-full px-4 py-3 transition-colors",
                  isActive
                    ? "text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                )}
                onClick={onClose}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
