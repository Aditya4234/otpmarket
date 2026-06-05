'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { formatDate } from '@/lib/utils'
import { Search } from 'lucide-react'

const logs = [
  { _id: '1', action: 'user.login', user: 'admin@otpmart.com', ip: '192.168.1.1', severity: 'info', details: 'Admin login from Mumbai, India', timestamp: '2025-05-25T10:30:00' },
  { _id: '2', action: 'user.create', user: 'admin@otpmart.com', ip: '192.168.1.1', severity: 'warning', details: 'Created user rahul@example.com', timestamp: '2025-05-25T09:15:00' },
  { _id: '3', action: 'order.refund', user: 'admin@otpmart.com', ip: '10.0.0.5', severity: 'critical', details: 'Refunded order #ORD-1234 for ₹2,999', timestamp: '2025-05-24T18:45:00' },
  { _id: '4', action: 'settings.update', user: 'admin@otpmart.com', ip: '192.168.1.1', severity: 'warning', details: 'Updated platform fee from 5% to 7%', timestamp: '2025-05-24T14:20:00' },
  { _id: '5', action: 'user.delete', user: 'admin@otpmart.com', ip: '10.0.0.5', severity: 'critical', details: 'Deleted user account spam@example.com', timestamp: '2025-05-23T11:00:00' },
  { _id: '6', action: 'kyc.verify', user: 'admin@otpmart.com', ip: '192.168.1.1', severity: 'info', details: 'Verified KYC for priya@example.com', timestamp: '2025-05-23T09:30:00' },
  { _id: '7', action: 'withdrawal.approve', user: 'admin@otpmart.com', ip: '10.0.0.5', severity: 'warning', details: 'Approved withdrawal of ₹5,000 for agent Amit', timestamp: '2025-05-22T16:00:00' },
]

export default function AdminActivityLogsPage() {
  const [search, setSearch] = useState('')
  const [filterAction, setFilterAction] = useState('')
  const [filterSeverity, setFilterSeverity] = useState('')
  const [dateRange, setDateRange] = useState({ from: '', to: '' })

  const filtered = logs.filter(log => {
    const matchesSearch = log.details.toLowerCase().includes(search.toLowerCase()) ||
      log.user.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase())
    const matchesAction = !filterAction || log.action.includes(filterAction)
    const matchesSeverity = !filterSeverity || log.severity === filterSeverity
    const matchesDate = (!dateRange.from || new Date(log.timestamp) >= new Date(dateRange.from)) &&
      (!dateRange.to || new Date(log.timestamp) <= new Date(dateRange.to + 'T23:59:59'))
    return matchesSearch && matchesAction && matchesSeverity && matchesDate
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Activity Logs</h1>
        <p className="text-sm text-gray-500 mt-1">Track all admin activities and system events</p>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input placeholder="Search logs..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
            </div>
            <div className="w-40">
              <Select placeholder="All Actions" options={[
                { value: 'user', label: 'User Actions' },
                { value: 'order', label: 'Order Actions' },
                { value: 'kyc', label: 'KYC Actions' },
                { value: 'withdrawal', label: 'Withdrawal Actions' },
                { value: 'settings', label: 'Settings' },
              ]} value={filterAction} onChange={e => setFilterAction(e.target.value)} />
            </div>
            <div className="w-36">
              <Select placeholder="All Severity" options={[
                { value: 'info', label: 'Info' },
                { value: 'warning', label: 'Warning' },
                { value: 'critical', label: 'Critical' },
              ]} value={filterSeverity} onChange={e => setFilterSeverity(e.target.value)} />
            </div>
            <Input type="date" value={dateRange.from} onChange={e => setDateRange(p => ({ ...p, from: e.target.value }))} className="w-40" />
            <Input type="date" value={dateRange.to} onChange={e => setDateRange(p => ({ ...p, to: e.target.value }))} className="w-40" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Action</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">User</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">IP</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Severity</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Details</th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(log => (
                  <tr key={log._id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">{log.action}</code>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{log.user}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{log.ip}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={log.severity} />
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{log.details}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 text-right">{formatDate(log.timestamp, 'long')}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="h-32 text-center text-gray-500">No logs found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
