'use client'

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { formatCurrency } from '@/lib/utils'
import { IndianRupee, ShoppingBag, Users, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react'

const revenueData = [
  { month: 'Jan', revenue: 45000 },
  { month: 'Feb', revenue: 52000 },
  { month: 'Mar', revenue: 48000 },
  { month: 'Apr', revenue: 61000 },
  { month: 'May', revenue: 75000 },
  { month: 'Jun', revenue: 82000 },
]

const topServices = [
  { service: 'OTP Verification', count: 15200, revenue: 152000 },
  { service: 'WhatsApp OTP', count: 8900, revenue: 89000 },
  { service: 'SMS Marketing', count: 4500, revenue: 67500 },
  { service: 'Email OTP', count: 3200, revenue: 16000 },
  { service: 'Voice OTP', count: 1200, revenue: 18000 },
]

const ordersByStatus = [
  { status: 'completed', count: 12500, percentage: 62 },
  { status: 'processing', count: 3200, percentage: 16 },
  { status: 'pending', count: 2800, percentage: 14 },
  { status: 'cancelled', count: 1200, percentage: 6 },
  { status: 'refunded', count: 400, percentage: 2 },
]

const maxRevenue = Math.max(...revenueData.map(d => d.revenue))

export default function AdminAnalyticsPage() {
  const statsCards = [
    { label: 'Total Revenue', value: formatCurrency(363000), icon: IndianRupee, change: '+23%', trend: 'up', subtitle: 'Last 6 months' },
    { label: 'Total Orders', value: '33,300', icon: ShoppingBag, change: '+18%', trend: 'up', subtitle: 'All time' },
    { label: 'Total Users', value: '12,450', icon: Users, change: '+12%', trend: 'up', subtitle: 'Registered' },
    { label: 'Avg. Order Value', value: formatCurrency(285), icon: TrendingUp, change: '+5%', trend: 'up', subtitle: 'Per order' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">Platform performance metrics and insights</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map(stat => {
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
                    <TrendIcon className="h-3 w-3 mr-0.5" /> {stat.change}
                  </span>
                </div>
                <p className="mt-4 text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
                <p className="text-xs text-gray-400">{stat.subtitle}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Monthly revenue for the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 h-40">
              {revenueData.map((item) => (
                <div key={item.month} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t bg-primary"
                    style={{ height: `${(item.revenue / maxRevenue) * 100}%`, minHeight: '8px' }}
                  />
                  <span className="text-xs text-gray-500">{item.month}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4">
              <span className="text-xs text-gray-500">Jan</span>
              <span className="text-xs text-gray-500">Jun</span>
            </div>
            <p className="text-sm text-gray-500 mt-4">Use the API to connect this page.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ordersByStatus.map(item => (
                <div key={item.status}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={item.status} />
                      <span className="text-sm text-gray-600">{item.count.toLocaleString()}</span>
                    </div>
                    <span className="text-sm font-medium">{item.percentage}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Services</CardTitle>
          <CardDescription>Most popular services by order count</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Service</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Orders</th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topServices.map(s => (
                  <tr key={s.service} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{s.service}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{s.count.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-right font-medium">{formatCurrency(s.revenue)}</td>
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
