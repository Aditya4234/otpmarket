'use client'

import { useState } from 'react'
import { useGetWalletQuery, useGetTransactionsQuery, useDepositFundsMutation } from '@/redux/api/walletApi'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { PageLoader } from '@/components/ui/Spinner'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Wallet, Plus, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import toast from 'react-hot-toast'

export default function UserWalletPage() {
  const { data: walletData, isLoading: walletLoading } = useGetWalletQuery()
  const { data: txData, isLoading: txLoading } = useGetTransactionsQuery({ page: 1, limit: 10 })
  const [depositFunds] = useDepositFundsMutation()
  const [showDeposit, setShowDeposit] = useState(false)
  const [amount, setAmount] = useState('')
  const [depositing, setDepositing] = useState(false)

  const handleDeposit = async () => {
    if (!amount || Number(amount) <= 0) { toast.error('Enter a valid amount'); return }
    setDepositing(true)
    try {
      const result = await depositFunds({ amount: Number(amount) }).unwrap()
      toast.success('Deposit initiated!')
      setShowDeposit(false)
      setAmount('')
      if (result.data?.orderId) {
        // Redirect to Razorpay checkout
      }
    } catch {
      toast.error('Failed to initiate deposit')
    } finally {
      setDepositing(false)
    }
  }

  if (walletLoading || txLoading) return <PageLoader />

  const wallet = walletData?.data
  const transactions = txData?.data || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Wallet</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your funds</p>
        </div>
        <Button onClick={() => setShowDeposit(true)}>
          <Plus className="h-4 w-4 mr-2" /> Add Funds
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-primary-50 p-4">
              <Wallet className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Available Balance</p>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(wallet?.balance || 0)}</p>
              <div className="flex gap-4 mt-1">
                <span className="text-xs text-gray-500">Deposited: {formatCurrency(wallet?.totalDeposited || 0)}</span>
                <span className="text-xs text-gray-500">Withdrawn: {formatCurrency(wallet?.totalWithdrawn || 0)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length > 0 ? (
            <div className="space-y-3">
              {transactions.map((tx: any) => (
                <div key={tx._id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className={`rounded-full p-2 ${tx.type === 'deposit' || tx.type === 'refund' ? 'bg-green-50' : 'bg-red-50'}`}>
                      {tx.type === 'deposit' || tx.type === 'refund'
                        ? <ArrowDownRight className={`h-4 w-4 text-green-600`} />
                        : <ArrowUpRight className={`h-4 w-4 text-red-600`} />
                      }
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{tx.description}</p>
                      <p className="text-xs text-gray-500">{formatDate(tx.createdAt, 'relative')}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${tx.type === 'deposit' || tx.type === 'refund' ? 'text-green-600' : 'text-red-600'}`}>
                      {tx.type === 'deposit' || tx.type === 'refund' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </p>
                    <StatusBadge status={tx.status} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-8">No transactions yet</p>
          )}
        </CardContent>
      </Card>

      <Modal isOpen={showDeposit} onClose={() => setShowDeposit(false)} title="Add Funds">
        <div className="space-y-4">
          <Input
            label="Amount (INR)"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount to deposit"
          />
          <p className="text-xs text-gray-500">You will be redirected to Razorpay for payment.</p>
          <Button className="w-full" onClick={handleDeposit} isLoading={depositing}>
            Proceed to Payment
          </Button>
        </div>
      </Modal>
    </div>
  )
}
