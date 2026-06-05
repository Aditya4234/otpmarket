'use client'

import { useGetWalletQuery, useGetEarningsQuery } from '@/redux/api/walletApi'
import { Card, CardContent } from '@/components/ui/Card'
import { PageLoader } from '@/components/ui/Spinner'
import { formatCurrency } from '@/lib/utils'
import { DollarSign, Wallet, TrendingUp, Clock } from 'lucide-react'

export default function AgentDashboardPage() {
  const { data: walletData, isLoading: walletLoading } = useGetWalletQuery()
  const { data: earningsData, isLoading: earningsLoading } = useGetEarningsQuery()

  if (walletLoading || earningsLoading) return <PageLoader />

  const wallet = walletData?.data
  const earnings = earningsData?.data

  const stats = [
    { label: 'Wallet Balance', value: formatCurrency(wallet?.balance || 0), icon: Wallet, change: '' },
    { label: 'Total Earnings', value: formatCurrency(earnings?.totalEarnings || 0), icon: DollarSign, change: '' },
    { label: 'Pending Earnings', value: formatCurrency(earnings?.pendingEarnings || 0), icon: Clock, change: '' },
    { label: 'Credited', value: formatCurrency(earnings?.creditedEarnings || 0), icon: TrendingUp, change: '' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Agent Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your OTP services and earnings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="rounded-lg bg-primary-50 p-3">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <p className="mt-4 text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'My Earnings', href: '/dashboard/agent/earnings' },
                { label: 'My Numbers', href: '/dashboard/agent/numbers' },
                { label: 'OTP Logs', href: '/dashboard/agent/otp-logs' },
                { label: 'Withdrawals', href: '/dashboard/agent/withdrawals' },
              ].map((action) => (
                <a
                  key={action.label}
                  href={action.href}
                  className="rounded-lg border p-4 text-center text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-primary transition-colors"
                >
                  {action.label}
                </a>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <p className="text-sm text-gray-500 text-center py-8">
              Your recent orders and earnings will appear here
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
