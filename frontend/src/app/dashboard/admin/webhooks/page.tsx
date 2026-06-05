'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { PageLoader } from '@/components/ui/Spinner'
import { formatDate } from '@/lib/utils'
import { Plus, RefreshCw, Globe } from 'lucide-react'
import toast from 'react-hot-toast'

const allEvents = [
  'order.created', 'order.completed', 'order.cancelled',
  'payment.success', 'payment.failed', 'payment.refunded',
  'user.created', 'user.verified', 'kyc.completed',
  'withdrawal.processed', 'ticket.created', 'ticket.resolved',
]

const initialWebhooks = [
  { _id: '1', url: 'https://api.example.com/webhooks/orders', events: ['order.created', 'order.completed'], secret: 'whsec_********', status: 'active', lastTriggered: '2025-05-25', createdAt: '2025-01-15' },
  { _id: '2', url: 'https://api.example.com/webhooks/payments', events: ['payment.success', 'payment.failed'], secret: 'whsec_********', status: 'active', lastTriggered: '2025-05-24', createdAt: '2025-02-10' },
  { _id: '3', url: 'https://staging.example.com/hooks', events: ['order.created'], secret: 'whsec_********', status: 'inactive', lastTriggered: '2025-04-20', createdAt: '2025-03-05' },
]

export default function AdminWebhooksPage() {
  const [webhooks, setWebhooks] = useState(initialWebhooks)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ url: '', events: [] as string[], status: 'active' })

  const openCreate = () => {
    setEditingId(null)
    setForm({ url: '', events: [], status: 'active' })
    setShowModal(true)
  }

  const openEdit = (wh: any) => {
    setEditingId(wh._id)
    setForm({ url: wh.url, events: [...wh.events], status: wh.status })
    setShowModal(true)
  }

  const toggleEvent = (event: string) => {
    setForm(prev => ({
      ...prev,
      events: prev.events.includes(event)
        ? prev.events.filter(e => e !== event)
        : [...prev.events, event],
    }))
  }

  const handleSave = () => {
    if (!form.url) { toast.error('Please enter a webhook URL'); return }
    if (editingId) {
      setWebhooks(prev => prev.map(w => w._id === editingId ? { ...w, ...form } : w))
      toast.success('Webhook updated')
    } else {
      setWebhooks(prev => [...prev, {
        _id: String(Date.now()),
        ...form,
        secret: 'whsec_********',
        lastTriggered: '-',
        createdAt: new Date().toISOString(),
      }])
      toast.success('Webhook created')
    }
    setShowModal(false)
  }

  const handleRegenerateSecret = (id: string) => {
    setWebhooks(prev => prev.map(w => w._id === id ? { ...w, secret: `whsec_${Math.random().toString(36).substring(2, 30)}` } : w))
    toast.success('Secret regenerated')
  }

  if (webhooks.length === 0) return <PageLoader />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Webhooks</h1>
          <p className="text-sm text-gray-500 mt-1">Manage webhook endpoints for event notifications</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 mr-2" /> Create Webhook
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">URL</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Events</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Last Triggered</th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {webhooks.map(wh => (
                  <tr key={wh._id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-gray-400" />
                        <code className="text-sm text-gray-700">{wh.url}</code>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {wh.events.slice(0, 3).map(e => (
                          <span key={e} className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700">{e}</span>
                        ))}
                        {wh.events.length > 3 && <span className="text-xs text-gray-400">+{wh.events.length - 3}</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={wh.status} /></td>
                    <td className="px-4 py-3 text-sm text-gray-500">{formatDate(wh.lastTriggered)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => openEdit(wh)}>Edit</Button>
                        <Button variant="ghost" size="sm" onClick={() => handleRegenerateSecret(wh._id)}>
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingId ? 'Edit Webhook' : 'Create Webhook'} size="lg">
        <div className="space-y-4">
          <Input label="Endpoint URL" value={form.url} onChange={e => setForm(p => ({ ...p, url: e.target.value }))} placeholder="https://api.yoursite.com/webhook" />
          <div>
            <p className="block text-sm font-medium text-gray-700 mb-2">Events</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {allEvents.map(event => (
                <label key={event} className="flex items-center gap-2 rounded-lg border p-2 text-sm cursor-pointer hover:bg-gray-50">
                  <input type="checkbox" checked={form.events.includes(event)} onChange={() => toggleEvent(event)} className="rounded border-gray-300" />
                  {event}
                </label>
              ))}
            </div>
          </div>
          <p className="text-sm text-gray-500">Use the API to connect this page.</p>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editingId ? 'Update' : 'Create'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
