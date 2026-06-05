'use client'

import { useGetOrdersQuery } from '@/redux/api/serviceApi'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { PageLoader } from '@/components/ui/Spinner'
import { Button } from '@/components/ui/Button'
import { formatCurrency, formatDate } from '@/lib/utils'
export default function UserOrdersPage() {
  const { data, isLoading } = useGetOrdersQuery({ page: 1, limit: 20 })

  if (isLoading) return <PageLoader />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
          <p className="text-sm text-gray-500 mt-1">Track your OTP service orders</p>
        </div>
        <Button onClick={() => window.location.href = '/services'}>
          New Order
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Order</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Service</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Qty</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Total</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Date</th>
                </tr>
              </thead>
              <tbody>
                {data?.data?.map((order: any) => (
                  <tr key={order._id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-mono">#{order._id.slice(-8).toUpperCase()}</td>
                    <td className="px-4 py-3 text-sm">
                      {typeof order.service === 'object' ? order.service.name : 'Service'}
                    </td>
                    <td className="px-4 py-3 text-sm">{order.quantity}</td>
                    <td className="px-4 py-3 text-sm font-medium">{formatCurrency(order.totalPrice)}</td>
                    <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
                    <td className="px-4 py-3 text-sm text-gray-500">{formatDate(order.createdAt, 'short')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
