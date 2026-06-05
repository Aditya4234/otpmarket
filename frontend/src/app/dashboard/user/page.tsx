'use client'

import { useGetOrdersQuery } from '@/redux/api/serviceApi'
import { useGetWalletQuery } from '@/redux/api/walletApi'
import { Card, CardContent } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { PageLoader } from '@/components/ui/Spinner'
import { formatCurrency, formatDate } from '@/lib/utils'
import { ShoppingBag, Wallet, Clock, CheckCircle } from 'lucide-react'

export default function UserDashboardPage() {
  const { data: ordersData, isLoading: ordersLoading } = useGetOrdersQuery({ page: 1, limit: 5 })
  const { data: walletData, isLoading: walletLoading } = useGetWalletQuery()

  if (ordersLoading || walletLoading) return <PageLoader />

  const orders = ordersData?.data || []
  const wallet = walletData?.data

  const stats = [
    { label: 'Total Orders', value: orders.length, icon: ShoppingBag, color: 'bg-blue-50 text-blue-600' },
    { label: 'Wallet Balance', value: formatCurrency(wallet?.balance || 0), icon: Wallet, color: 'bg-green-50 text-green-600' },
    { label: 'Pending', value: orders.filter((o: any) => o.status === 'pending').length, icon: Clock, color: 'bg-yellow-50 text-yellow-600' },
    { label: 'Completed', value: orders.filter((o: any) => o.status === 'completed').length, icon: CheckCircle, color: 'bg-green-50 text-green-600' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Overview of your account</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className={`rounded-lg p-3 ${stat.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
                <p className="mt-4 text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
          {orders.length > 0 ? (
            <div className="space-y-3">
              {orders.map((order: any) => (
                <div key={order._id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {typeof order.service === 'object' ? order.service.name : 'Service'}
                    </p>
                    <p className="text-xs text-gray-500">{formatDate(order.createdAt, 'relative')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatCurrency(order.totalPrice)}</p>
                    <StatusBadge status={order.status} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-8">
              No orders yet. Browse services to get started!
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
