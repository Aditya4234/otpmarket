'use client'

import { useState } from 'react'
import { useGetWithdrawalsQuery, useProcessWithdrawalMutation } from '@/redux/api/adminApi'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { PageLoader } from '@/components/ui/Spinner'
import { Modal } from '@/components/ui/Modal'
import { Textarea } from '@/components/ui/Textarea'
import { formatCurrency, formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function AdminWithdrawalsPage() {
  const [page] = useState(1)
  const { data, isLoading } = useGetWithdrawalsQuery({ page, limit: 10 })
  const [processWithdrawal] = useProcessWithdrawalMutation()
  const [selectedW, setSelectedW] = useState<any>(null)
  const [adminNote, setAdminNote] = useState('')

  const handleProcess = async (id: string, status: string) => {
    try {
      await processWithdrawal({ id, status, adminNote }).unwrap()
      toast.success(`Withdrawal ${status} successfully`)
      setSelectedW(null)
      setAdminNote('')
    } catch {
      toast.error('Failed to process withdrawal')
    }
  }

  if (isLoading) return <PageLoader />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Withdrawals</h1>
        <p className="text-sm text-gray-500 mt-1">Manage agent withdrawal requests</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Agent</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Net Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Date</th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.data?.map((w: any) => (
                  <tr key={w._id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {typeof w.agent === 'object' ? w.agent.name : 'Agent'}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {formatCurrency(w.amount)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {formatCurrency(w.netAmount)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={w.status} />
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {formatDate(w.createdAt, 'short')}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {w.status === 'pending' && (
                        <Button size="sm" onClick={() => setSelectedW(w)}>
                          Process
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Modal
        isOpen={!!selectedW}
        onClose={() => { setSelectedW(null); setAdminNote('') }}
        title="Process Withdrawal"
      >
        {selectedW && (
          <div className="space-y-4">
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-600">Requested Amount: <strong>{formatCurrency(selectedW.amount)}</strong></p>
              <p className="text-sm text-gray-600">Net Amount: <strong>{formatCurrency(selectedW.netAmount)}</strong></p>
              <p className="text-sm text-gray-600">Fee: <strong>{formatCurrency(selectedW.fee)}</strong></p>
            </div>
            <Textarea
              label="Admin Note (optional)"
              placeholder="Add a note..."
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
            />
            <div className="flex gap-3">
              <Button
                variant="danger"
                className="flex-1"
                onClick={() => handleProcess(selectedW._id, 'rejected')}
              >
                Reject
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                onClick={() => handleProcess(selectedW._id, 'approved')}
              >
                Approve
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
