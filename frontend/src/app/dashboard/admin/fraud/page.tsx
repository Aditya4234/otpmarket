'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { PageLoader } from '@/components/ui/Spinner'
import { formatCurrency, formatDate } from '@/lib/utils'
import { AlertTriangle, ShieldCheck, TrendingUp, Activity, Eye, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const alerts = [
  { _id: '1', type: 'multiple_attempts', user: 'suspicious@example.com', description: 'Multiple OTP requests from same IP in 5 minutes', severity: 'high', status: 'open', amount: 0, detectedAt: '2025-05-25T08:30:00' },
  { _id: '2', type: 'unusual_amount', user: 'user@example.com', description: 'Order amount ₹49,999 exceeds usual spending pattern', severity: 'medium', status: 'investigating', amount: 49999, detectedAt: '2025-05-24T14:20:00' },
  { _id: '3', type: 'new_device', user: 'rahul@example.com', description: 'Login from unrecognized device in different city', severity: 'medium', status: 'open', amount: 0, detectedAt: '2025-05-24T10:00:00' },
  { _id: '4', type: 'chargeback', user: 'priya@example.com', description: 'Payment chargeback initiated for order #ORD-5678', severity: 'high', status: 'resolved', amount: 2999, detectedAt: '2025-05-22T09:15:00', resolution: 'Refund processed, account flagged' },
  { _id: '5', type: 'rapid_requests', user: 'bot@example.com', description: '100+ API requests per minute from single key', severity: 'critical', status: 'open', amount: 0, detectedAt: '2025-05-25T11:00:00' },
]

const stats = {
  totalAlerts: 15,
  openAlerts: 8,
  criticalAlerts: 3,
  resolvedAlerts: 7,
}

export default function AdminFraudPage() {
  const [fraudAlerts, setFraudAlerts] = useState(alerts)
  const [selected, setSelected] = useState<any>(null)
  const [showResolve, setShowResolve] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleResolve = async () => {
    setIsLoading(true)
    await new Promise(r => setTimeout(r, 800))
    setFraudAlerts(prev => prev.map(a => a._id === selected._id ? { ...a, status: 'resolved', resolution: 'Reviewed and resolved by admin' } : a))
    setIsLoading(false)
    setShowResolve(false)
    toast.success('Alert resolved')
  }

  if (isLoading) return <PageLoader />

  const statCards = [
    { label: 'Total Alerts', value: stats.totalAlerts, icon: AlertTriangle, color: 'text-gray-600', bg: 'bg-gray-50' },
    { label: 'Open Alerts', value: stats.openAlerts, icon: Activity, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'Critical', value: stats.criticalAlerts, icon: TrendingUp, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Resolved', value: stats.resolvedAlerts, icon: ShieldCheck, color: 'text-green-600', bg: 'bg-green-50' },
  ]

  const severityVariant: Record<string, 'warning' | 'danger' | 'info'> = {
    low: 'info',
    medium: 'warning',
    high: 'danger',
    critical: 'danger',
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Fraud Detection</h1>
        <p className="text-sm text-gray-500 mt-1">Monitor and investigate suspicious activities</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(s => {
          const Icon = s.icon
          return (
            <Card key={s.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className={`rounded-lg ${s.bg} p-3`}>
                    <Icon className={`h-6 w-6 ${s.color}`} />
                  </div>
                </div>
                <p className="mt-4 text-2xl font-bold text-gray-900">{s.value}</p>
                <p className="text-sm text-gray-500">{s.label}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">User</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Severity</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Detected</th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {fraudAlerts.map(alert => (
                  <tr key={alert._id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm capitalize">{alert.type.replace(/_/g, ' ')}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{alert.user}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{alert.description}</td>
                    <td className="px-4 py-3">
                      <Badge variant={severityVariant[alert.severity] || 'default'}>{alert.severity}</Badge>
                    </td>
                    <td className="px-4 py-3 text-sm">{alert.amount ? formatCurrency(alert.amount) : '-'}</td>
                    <td className="px-4 py-3"><StatusBadge status={alert.status} /></td>
                    <td className="px-4 py-3 text-sm text-gray-500">{formatDate(alert.detectedAt)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => { setSelected(alert); setShowResolve(true) }}>
                          <Eye className="h-4 w-4 mr-1" /> View
                        </Button>
                        {alert.status !== 'resolved' && (
                          <Button variant="ghost" size="sm" onClick={() => { setSelected(alert); setShowResolve(true) }}>
                            <CheckCircle className="h-4 w-4 mr-1 text-green-500" /> Resolve
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Modal isOpen={showResolve} onClose={() => setShowResolve(false)} title="Alert Details" size="md">
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Type</p>
                <p className="text-sm capitalize">{selected.type.replace(/_/g, ' ')}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">User</p>
                <p className="text-sm">{selected.user}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Severity</p>
                <Badge variant={severityVariant[selected.severity] || 'default'}>{selected.severity}</Badge>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Status</p>
                <StatusBadge status={selected.status} />
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Description</p>
              <p className="text-sm mt-1">{selected.description}</p>
            </div>
            {selected.resolution && (
              <div className="rounded-lg bg-green-50 p-3">
                <p className="text-xs font-medium text-green-700">Resolution</p>
                <p className="text-sm text-green-600 mt-1">{selected.resolution}</p>
              </div>
            )}
            <p className="text-sm text-gray-500">Use the API to connect this page.</p>
            {selected.status !== 'resolved' && (
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowResolve(false)}>Cancel</Button>
                <Button onClick={handleResolve}>
                  <CheckCircle className="h-4 w-4 mr-2" /> Resolve Alert
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
