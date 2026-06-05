'use client'

import { useGetDashboardStatsQuery } from '@/redux/api/adminApi'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { PageLoader } from '@/components/ui/Spinner'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { formatCurrency } from '@/lib/utils'
import { Users, UserCheck, ShoppingBag, IndianRupee, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react'

export default function AdminDashboardPage() {
  const { data, isLoading } = useGetDashboardStatsQuery()

  if (isLoading) return <PageLoader />

  const stats = data?.data

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, change: '+12%', trend: 'up' },
    { label: 'Total Agents', value: stats?.totalAgents || 0, icon: UserCheck, change: '+5%', trend: 'up' },
    { label: 'Total Orders', value: stats?.totalOrders || 0, icon: ShoppingBag, change: '+18%', trend: 'up' },
    { label: 'Revenue', value: formatCurrency(stats?.totalRevenue || 0), icon: IndianRupee, change: '+23%', trend: 'up' },
    { label: 'Pending Withdrawals', value: stats?.pendingWithdrawals || 0, icon: Wallet, change: '-2%', trend: 'down' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Overview of your marketplace</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon
          const TrendIcon = stat.trend === 'up' ? ArrowUpRight : ArrowDownRight
          return (
            <Card key={stat.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="rounded-lg bg-primary-50 p-3">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <span className={`flex items-center text-xs font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    <TrendIcon className="h-3 w-3 mr-0.5" />
                    {stat.change}
                  </span>
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
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.recentOrders && stats.recentOrders.length > 0 ? (
              <div className="space-y-3">
                {stats.recentOrders.slice(0, 5).map((order: any) => (
                  <div key={order._id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {typeof order.service === 'object' ? order.service.name : 'Service'}
                      </p>
                      <p className="text-xs text-gray-500">Qty: {order.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{formatCurrency(order.totalPrice)}</p>
                      <StatusBadge status={order.status} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No recent orders</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Manage Users', href: '/dashboard/admin/users' },
                { label: 'Manage Agents', href: '/dashboard/admin/agents' },
                { label: 'View Orders', href: '/dashboard/admin/orders' },
                { label: 'Reports', href: '/dashboard/admin/reports' },
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
      </div>
    </div>
  )
}
