'use client'

import { Bell, Menu, Search } from 'lucide-react'
import { useAppSelector } from '@/redux/hooks'
import { Avatar } from '@/components/ui'
import { Input } from '@/components/ui/Input'
import { useRouter } from 'next/navigation'

interface HeaderProps {
  onToggleSidebar: () => void
}

export function Header({ onToggleSidebar }: HeaderProps) {
  const { user } = useAppSelector((state) => state.auth)
  const router = useRouter()

  const dashboardBase = `/dashboard/${user?.role || 'user'}`

  const handleNotification = () => {
    router.push(`${dashboardBase}/notifications`)
  }

  const handleProfile = () => {
    router.push(`${dashboardBase}/profile`)
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 bg-[#000000] px-4 lg:px-6">
      <button
        onClick={onToggleSidebar}
        className="rounded-md p-2 hover:bg-white/10"
      >
        <Menu className="h-5 w-5 text-white" />
      </button>

      <div className="flex-1 max-w-md hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search..."
            className="pl-10 bg-gray-50 border-0"
          />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-3">
        {/* Notification */}
        <button
          onClick={handleNotification}
          className="relative rounded-md p-2 hover:bg-white/10"
        >
          <Bell className="h-5 w-5 text-white" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>

        {/* Profile */}
        <button
          onClick={handleProfile}
          className="flex items-center gap-2 rounded-md p-1 hover:bg-white/10"
        >
          <Avatar name={user?.name || 'User'} size="sm" />

          <div className="hidden md:block text-left">
            <p className="text-sm font-medium text-white">
              {user?.name}
            </p>
            <p className="text-xs text-gray-400 capitalize">
              {user?.role}
            </p>
          </div>
        </button>
      </div>
    </header>
  )
}