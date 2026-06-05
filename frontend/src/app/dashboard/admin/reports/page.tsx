'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { PageLoader } from '@/components/ui/Spinner'
import { formatCurrency } from '@/lib/utils'
import { FileText, FileSpreadsheet } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminReportsPage() {
  const [dateRange, setDateRange] = useState({ from: '', to: '' })
  const [reportType, setReportType] = useState('orders')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleExport = async (format: 'pdf' | 'excel') => {
    setIsGenerating(true)
    await new Promise(r => setTimeout(r, 1500))
    setIsGenerating(false)
    toast.success(`${format.toUpperCase()} report generated successfully`)
  }

  if (isGenerating) return <PageLoader />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <p className="text-sm text-gray-500 mt-1">Generate and export platform reports</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Report Settings</CardTitle>
            <CardDescription>Configure your report parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select label="Report Type" options={[
              { value: 'orders', label: 'Orders Report' },
              { value: 'users', label: 'Users Report' },
              { value: 'transactions', label: 'Transactions Report' },
            ]} value={reportType} onChange={e => setReportType(e.target.value)} />

            <div>
              <p className="block text-sm font-medium text-gray-700 mb-1">Date Range</p>
              <div className="flex gap-2">
                <Input type="date" value={dateRange.from} onChange={e => setDateRange(p => ({ ...p, from: e.target.value }))} />
                <Input type="date" value={dateRange.to} onChange={e => setDateRange(p => ({ ...p, to: e.target.value }))} />
              </div>
            </div>

            <div className="pt-4 space-y-3">
              <Button className="w-full" onClick={() => handleExport('pdf')}>
                <FileText className="h-4 w-4 mr-2" /> Export as PDF
              </Button>
              <Button className="w-full" variant="outline" onClick={() => handleExport('excel')}>
                <FileSpreadsheet className="h-4 w-4 mr-2" /> Export as Excel
              </Button>
            </div>

            <p className="text-sm text-gray-500 pt-2">Use the API to connect this page.</p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Report Preview</CardTitle>
            <CardDescription>Summary of the selected report</CardDescription>
          </CardHeader>
          <CardContent>
            {reportType === 'orders' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">Total Orders</p>
                    <p className="text-2xl font-bold">12,450</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">Total Revenue</p>
                    <p className="text-2xl font-bold">{formatCurrency(363000)}</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">Avg Order Value</p>
                    <p className="text-2xl font-bold">{formatCurrency(285)}</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">Completion Rate</p>
                    <p className="text-2xl font-bold">62%</p>
                  </div>
                </div>
              </div>
            )}

            {reportType === 'users' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">Total Users</p>
                    <p className="text-2xl font-bold">12,450</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">Active Agents</p>
                    <p className="text-2xl font-bold">1,280</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">New This Month</p>
                    <p className="text-2xl font-bold">890</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">KYC Verified</p>
                    <p className="text-2xl font-bold">8,450</p>
                  </div>
                </div>
              </div>
            )}

            {reportType === 'transactions' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">Total Transactions</p>
                    <p className="text-2xl font-bold">45,200</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">Total Volume</p>
                    <p className="text-2xl font-bold">{formatCurrency(890000)}</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">Success Rate</p>
                    <p className="text-2xl font-bold">94%</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">Refund Rate</p>
                    <p className="text-2xl font-bold">2.1%</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
