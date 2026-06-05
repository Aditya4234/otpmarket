'use client'

import { useGetWithdrawalsQuery, useRequestWithdrawalMutation } from '@/redux/api/walletApi'
import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { PageLoader } from '@/components/ui/Spinner'
import { formatCurrency, formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function AgentWithdrawalsPage() {
  const [page] = useState(1)
  const { data, isLoading } = useGetWithdrawalsQuery({ page, limit: 10 })
  const [requestWithdrawal] = useRequestWithdrawalMutation()
  const [showModal, setShowModal] = useState(false)
  const [amount, setAmount] = useState('')
  const [accountDetails, setAccountDetails] = useState({
    bankName: '', accountNumber: '', accountHolder: '', ifscCode: '', upiId: '',
  })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!amount || Number(amount) <= 0) {
      toast.error('Enter a valid amount')
      return
    }
    setSubmitting(true)
    try {
      await requestWithdrawal({
        amount: Number(amount),
        accountDetails,
      }).unwrap()
      toast.success('Withdrawal request submitted')
      setShowModal(false)
      setAmount('')
    } catch {
      toast.error('Failed to submit withdrawal')
    } finally {
      setSubmitting(false)
    }
  }

  if (isLoading) return <PageLoader />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Withdrawals</h1>
          <p className="text-sm text-gray-500 mt-1">Request and track withdrawals</p>
        </div>
        <Button onClick={() => setShowModal(true)}>Request Withdrawal</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Withdrawal History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Fee</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Net</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Date</th>
                </tr>
              </thead>
              <tbody>
                {data?.data?.map((w: any) => (
                  <tr key={w._id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium">{formatCurrency(w.amount)}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{formatCurrency(w.fee)}</td>
                    <td className="px-4 py-3 text-sm font-medium">{formatCurrency(w.netAmount)}</td>
                    <td className="px-4 py-3"><StatusBadge status={w.status} /></td>
                    <td className="px-4 py-3 text-sm text-gray-500">{formatDate(w.createdAt, 'short')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Request Withdrawal">
        <div className="space-y-4">
          <Input label="Amount (INR)" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount" />
          <Input label="Bank Name" value={accountDetails.bankName} onChange={(e) => setAccountDetails({ ...accountDetails, bankName: e.target.value })} />
          <Input label="Account Number" value={accountDetails.accountNumber} onChange={(e) => setAccountDetails({ ...accountDetails, accountNumber: e.target.value })} />
          <Input label="Account Holder Name" value={accountDetails.accountHolder} onChange={(e) => setAccountDetails({ ...accountDetails, accountHolder: e.target.value })} />
          <Input label="IFSC Code" value={accountDetails.ifscCode} onChange={(e) => setAccountDetails({ ...accountDetails, ifscCode: e.target.value })} />
          <Input label="UPI ID (optional)" value={accountDetails.upiId} onChange={(e) => setAccountDetails({ ...accountDetails, upiId: e.target.value })} />
          <Button className="w-full" onClick={handleSubmit} isLoading={submitting}>Submit Request</Button>
        </div>
      </Modal>
    </div>
  )
}
