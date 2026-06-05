'use client'

import { useGetTicketsQuery, useCreateTicketMutation } from '@/redux/api/ticketApi'
import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Modal } from '@/components/ui/Modal'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { PageLoader } from '@/components/ui/Spinner'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function UserTicketsPage() {
  const { data, isLoading } = useGetTicketsQuery({ page: 1, limit: 10 })
  const [createTicket] = useCreateTicketMutation()
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ subject: '', description: '', category: 'other', priority: 'medium' })
  const [submitting, setSubmitting] = useState(false)

  const handleCreate = async () => {
    if (!form.subject || !form.description) { toast.error('Fill all fields'); return }
    setSubmitting(true)
    try {
      await createTicket(form).unwrap()
      toast.success('Ticket created')
      setShowModal(false)
      setForm({ subject: '', description: '', category: 'other', priority: 'medium' })
    } catch {
      toast.error('Failed to create ticket')
    } finally {
      setSubmitting(false)
    }
  }

  if (isLoading) return <PageLoader />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Support Tickets</h1>
          <p className="text-sm text-gray-500 mt-1">Get help from our support team</p>
        </div>
        <Button onClick={() => setShowModal(true)}>Create Ticket</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          {(data?.data?.length ?? 0) > 0 ? (
            <div className="space-y-3">
              {data!.data!.map((ticket: any) => (
                <div key={ticket._id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{ticket.subject}</p>
                    <p className="text-xs text-gray-500">{formatDate(ticket.createdAt, 'relative')}</p>
                  </div>
                  <div className="flex gap-2">
                    <StatusBadge status={ticket.priority} />
                    <StatusBadge status={ticket.status} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-8">No tickets yet</p>
          )}
        </CardContent>
      </Card>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create Ticket">
        <div className="space-y-4">
          <Input label="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Brief description of the issue" />
          <Select label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} options={[
            { value: 'order', label: 'Order Issue' },
            { value: 'payment', label: 'Payment Issue' },
            { value: 'account', label: 'Account Issue' },
            { value: 'technical', label: 'Technical Issue' },
            { value: 'other', label: 'Other' },
          ]} />
          <Select label="Priority" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} options={[
            { value: 'low', label: 'Low' },
            { value: 'medium', label: 'Medium' },
            { value: 'high', label: 'High' },
            { value: 'urgent', label: 'Urgent' },
          ]} />
          <Textarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe your issue in detail" />
          <Button className="w-full" onClick={handleCreate} isLoading={submitting}>Submit Ticket</Button>
        </div>
      </Modal>
    </div>
  )
}
