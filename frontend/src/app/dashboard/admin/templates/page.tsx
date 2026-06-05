'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Modal } from '@/components/ui/Modal'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { formatDate } from '@/lib/utils'
import { Plus, Mail, Eye, Send } from 'lucide-react'
import toast from 'react-hot-toast'

const initialTemplates = [
  { _id: '1', name: 'Welcome Email', subject: 'Welcome to OTPMart!', category: 'onboarding', status: 'active', body: '<h1>Welcome {{name}}!</h1><p>Thanks for joining.</p>', updatedAt: '2025-05-20' },
  { _id: '2', name: 'Order Confirmation', subject: 'Order #{{orderId}} Confirmed', category: 'transactional', status: 'active', body: '<h1>Order Confirmed</h1><p>Your order #{{orderId}} is being processed.</p>', updatedAt: '2025-05-18' },
  { _id: '3', name: 'Password Reset', subject: 'Reset Your Password', category: 'security', status: 'active', body: '<p>Click <a href="{{resetLink}}">here</a> to reset your password.</p>', updatedAt: '2025-04-25' },
  { _id: '4', name: 'KYC Verified', subject: 'Your KYC is Verified', category: 'verification', status: 'draft', body: '<p>Congratulations! Your KYC has been verified.</p>', updatedAt: '2025-05-10' },
]

export default function AdminTemplatesPage() {
  const [templates, setTemplates] = useState(initialTemplates)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [preview, setPreview] = useState(false)
  const [form, setForm] = useState({ name: '', subject: '', category: 'transactional', body: '', status: 'active' })

  const openCreate = () => {
    setEditingId(null)
    setForm({ name: '', subject: '', category: 'transactional', body: '', status: 'active' })
    setPreview(false)
    setShowModal(true)
  }

  const openEdit = (tpl: any) => {
    setEditingId(tpl._id)
    setForm({ name: tpl.name, subject: tpl.subject, category: tpl.category, body: tpl.body, status: tpl.status })
    setPreview(false)
    setShowModal(true)
  }

  const handleSave = () => {
    if (!form.name || !form.subject) { toast.error('Please fill required fields'); return }
    if (editingId) {
      setTemplates(prev => prev.map(t => t._id === editingId ? { ...t, ...form, updatedAt: new Date().toISOString() } : t))
      toast.success('Template updated')
    } else {
      setTemplates(prev => [...prev, { _id: String(Date.now()), ...form, updatedAt: new Date().toISOString() }])
      toast.success('Template created')
    }
    setShowModal(false)
  }

  const handleTestSend = () => {
    toast.success('Test email sent to admin@otpmart.com')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Email Templates</h1>
          <p className="text-sm text-gray-500 mt-1">Manage email notification templates</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 mr-2" /> Create Template
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map(tpl => (
          <Card key={tpl._id}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary-50 p-2 mt-1">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{tpl.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{tpl.subject}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <StatusBadge status={tpl.status} />
                      <span className="text-xs text-gray-400 capitalize">{tpl.category}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => openEdit(tpl)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleTestSend}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-3">Updated {formatDate(tpl.updatedAt)}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingId ? 'Edit Template' : 'Create Template'} size="xl">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Template Name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Welcome Email" />
            <Select label="Category" options={[
              { value: 'transactional', label: 'Transactional' },
              { value: 'onboarding', label: 'Onboarding' },
              { value: 'security', label: 'Security' },
              { value: 'verification', label: 'Verification' },
              { value: 'marketing', label: 'Marketing' },
            ]} value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} />
          </div>
          <Input label="Subject Line" value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} placeholder="Enter email subject" />

          <div>
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-medium text-gray-700">Email Body (HTML)</p>
              <button type="button" onClick={() => setPreview(!preview)} className="text-xs text-primary hover:underline">
                {preview ? 'Edit' : 'Preview'}
              </button>
            </div>
            {preview ? (
              <div className="min-h-[200px] rounded-md border p-4 bg-white" dangerouslySetInnerHTML={{ __html: form.body || '<p class="text-gray-400">No content</p>' }} />
            ) : (
              <Textarea value={form.body} onChange={e => setForm(p => ({ ...p, body: e.target.value }))} placeholder="<h1>Hello {{name}}!</h1>" className="min-h-[200px] font-mono text-sm" />
            )}
          </div>

          <p className="text-sm text-gray-500">Use the API to connect this page.</p>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={handleTestSend}>
              <Send className="h-4 w-4 mr-2" /> Send Test
            </Button>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button onClick={handleSave}>{editingId ? 'Update' : 'Create'}</Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}
