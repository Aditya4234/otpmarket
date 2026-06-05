'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { formatCurrency, formatDate } from '@/lib/utils'
import { CheckCircle2, CreditCard, ArrowUpDown } from 'lucide-react'
import toast from 'react-hot-toast'

const plans = [
  { name: 'Starter', price: 999, users: 10, features: ['Basic Support', '1 API Key', '1000 Requests/mo'] },
  { name: 'Professional', price: 2999, users: 50, features: ['Priority Support', '5 API Keys', '10000 Requests/mo', 'Advanced Analytics'] },
  { name: 'Enterprise', price: 9999, users: -1, features: ['Dedicated Support', 'Unlimited API Keys', 'Unlimited Requests', 'Custom Integrations', 'SLA Guarantee'] },
]

const invoices = [
  { _id: '1', date: '2025-05-01', amount: 2999, status: 'paid', plan: 'Professional' },
  { _id: '2', date: '2025-04-01', amount: 2999, status: 'paid', plan: 'Professional' },
  { _id: '3', date: '2025-03-01', amount: 999, status: 'paid', plan: 'Starter' },
  { _id: '4', date: '2025-02-01', amount: 999, status: 'paid', plan: 'Starter' },
]

export default function AdminSubscriptionsPage() {
  const [currentPlan, setCurrentPlan] = useState('Professional')
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [showDowngrade, setShowDowngrade] = useState(false)

  const planDetails = plans.find(p => p.name === currentPlan)!

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Subscriptions</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your plan and billing</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>You are on the {currentPlan} plan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(planDetails.price)}<span className="text-base font-normal text-gray-500">/mo</span></p>
              <p className="text-sm text-gray-500 mt-1">{planDetails.users === -1 ? 'Unlimited users' : `Up to ${planDetails.users} users`}</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowDowngrade(true)} disabled={currentPlan === 'Starter'}>
                <ArrowUpDown className="h-4 w-4 mr-2" /> Downgrade
              </Button>
              <Button onClick={() => setShowUpgrade(true)} disabled={currentPlan === 'Enterprise'}>
                <ArrowUpDown className="h-4 w-4 mr-2" /> Upgrade
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {planDetails.features.map(f => (
              <div key={f} className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle2 className="h-4 w-4 text-green-500" /> {f}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Available Plans</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map(plan => {
              const isCurrent = plan.name === currentPlan
              return (
                <div key={plan.name} className={`rounded-lg border p-6 ${isCurrent ? 'border-primary ring-2 ring-primary' : ''}`}>
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  <p className="text-2xl font-bold mt-2">{formatCurrency(plan.price)}<span className="text-sm font-normal text-gray-500">/mo</span></p>
                  <ul className="mt-4 space-y-2">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500 flex-shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                  {isCurrent && <p className="text-xs text-primary mt-4 text-center font-medium">Current Plan</p>}
                </div>
              )
            })}
          </div>
          <p className="text-sm text-gray-500 mt-4">Use the API to connect this page.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Invoice History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Plan</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">Invoice</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map(inv => (
                  <tr key={inv._id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-700">{formatDate(inv.date)}</td>
                    <td className="px-4 py-3 text-sm">{inv.plan}</td>
                    <td className="px-4 py-3 text-sm font-medium">{formatCurrency(inv.amount)}</td>
                    <td className="px-4 py-3"><StatusBadge status={inv.status} /></td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="sm"><CreditCard className="h-4 w-4 mr-1" /> View</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Modal isOpen={showUpgrade} onClose={() => setShowUpgrade(false)} title="Upgrade Plan" size="md">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Are you sure you want to upgrade your plan?</p>
          <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-700">
            <p>Recommended: Enterprise plan for unlimited access.</p>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowUpgrade(false)}>Cancel</Button>
            <Button onClick={() => { setCurrentPlan('Enterprise'); setShowUpgrade(false); toast.success('Plan upgraded') }}>Confirm Upgrade</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showDowngrade} onClose={() => setShowDowngrade(false)} title="Downgrade Plan" size="md">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Are you sure you want to downgrade your plan? Some features may be lost.</p>
          <div className="rounded-lg bg-yellow-50 p-4 text-sm text-yellow-700">
            <p>Warning: Downgrading may affect active services.</p>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowDowngrade(false)}>Cancel</Button>
            <Button onClick={() => { setCurrentPlan('Starter'); setShowDowngrade(false); toast.success('Plan downgraded') }} variant="danger">Confirm Downgrade</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
