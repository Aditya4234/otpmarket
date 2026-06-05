'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, ShoppingBag, Ticket, Wallet,
  Bell, CreditCard, LogOut, Users, Package,
  Key, Gift, MessageCircle, ShieldCheck,
  BarChart3, UserCheck, FolderTree, Building2,
  Smartphone, PhoneCall, DollarSign, Activity,
  AlertTriangle, FileText, Mail, Globe, Settings,
} from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { logout } from '@/redux/slices/authSlice'
import { X } from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const adminLinks = [
  { href: '/dashboard/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/admin/users', label: 'Users', icon: Users },
  { href: '/dashboard/admin/agents', label: 'Agents', icon: UserCheck },
  { href: '/dashboard/admin/tenants', label: 'Tenants', icon: Building2 },
  { href: '/dashboard/admin/subscriptions', label: 'Subscriptions', icon: CreditCard },
  { href: '/dashboard/admin/services', label: 'Services', icon: Package },
  { href: '/dashboard/admin/categories', label: 'Categories', icon: FolderTree },
  { href: '/dashboard/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/dashboard/admin/tickets', label: 'Tickets', icon: Ticket },
  { href: '/dashboard/admin/transactions', label: 'Transactions', icon: CreditCard },
  { href: '/dashboard/admin/withdrawals', label: 'Withdrawals', icon: DollarSign },
  { href: '/dashboard/admin/kyc', label: 'KYC', icon: ShieldCheck },
  { href: '/dashboard/admin/api-keys', label: 'API Keys', icon: Key },
  { href: '/dashboard/admin/webhooks', label: 'Webhooks', icon: Globe },
  { href: '/dashboard/admin/activity-logs', label: 'Activity Logs', icon: Activity },
  { href: '/dashboard/admin/fraud', label: 'Fraud Detection', icon: AlertTriangle },
  { href: '/dashboard/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/admin/reports', label: 'Reports', icon: FileText },
  { href: '/dashboard/admin/templates', label: 'Email Templates', icon: Mail },
  { href: '/dashboard/admin/chat', label: 'Live Chat', icon: MessageCircle },
  { href: '/dashboard/admin/settings', label: 'Settings', icon: Settings },
]

const agentLinks = [
  { href: '/dashboard/agent', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/agent/earnings', label: 'Earnings', icon: DollarSign },
  { href: '/dashboard/agent/numbers', label: 'Numbers', icon: Smartphone },
  { href: '/dashboard/agent/otp-logs', label: 'OTP Logs', icon: PhoneCall },
  { href: '/dashboard/agent/withdrawals', label: 'Withdrawals', icon: Wallet },
]

const userLinks = [
  { href: '/dashboard/user', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/user/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/dashboard/user/wallet', label: 'Wallet', icon: Wallet },
  { href: '/dashboard/user/transactions', label: 'Transactions', icon: CreditCard },
  { href: '/dashboard/user/tickets', label: 'Tickets', icon: Ticket },
  { href: '/dashboard/user/notifications', label: 'Notifications', icon: Bell },
  { href: '/dashboard/user/profile', label: 'Profile', icon: Users },
  { href: '/dashboard/user/two-factor', label: '2FA', icon: ShieldCheck },
  { href: '/dashboard/user/referrals', label: 'Referrals', icon: Gift },
  { href: '/dashboard/user/api-keys', label: 'API Keys', icon: Key },
  { href: '/dashboard/user/chat', label: 'Live Chat', icon: MessageCircle },
]

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)

  const role = user?.role || 'user'
  const links = role === 'admin' ? adminLinks : role === 'agent' ? agentLinks : userLinks

  const handleNavigation = () => {
    onClose()
  }

  const handleLogout = () => {
    dispatch(logout())
    onClose()
    window.location.href = '/login'
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed left-0 top-0 z-50 flex h-screen flex-col border-r bg-white transition-all duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0 lg:z-40 lg:w-64'
        )}
      >
        <div className="flex h-16 items-center justify-between border-b px-4 lg:px-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">OTPMart</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 hover:bg-gray-100 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {links.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={handleNavigation}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span>{link.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="border-t p-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}
