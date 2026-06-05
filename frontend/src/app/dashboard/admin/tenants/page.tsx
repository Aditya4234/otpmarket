'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Modal } from '@/components/ui/Modal'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { PageLoader } from '@/components/ui/Spinner'
import { formatDate } from '@/lib/utils'
import { Building2, Plus, Search } from 'lucide-react'
import toast from 'react-hot-toast'

const initialTenants = [
  { _id: '1', name: 'Acme Corp', domain: 'acme.example.com', email: 'admin@acme.com', plan: 'enterprise', status: 'active', users: 45, createdAt: '2025-01-15' },
  { _id: '2', name: 'Globex Inc', domain: 'globex.example.com', email: 'admin@globex.com', plan: 'professional', status: 'active', users: 23, createdAt: '2025-02-20' },
  { _id: '3', name: 'Initech', domain: 'initech.example.com', email: 'admin@initech.com', plan: 'starter', status: 'suspended', users: 8, createdAt: '2025-03-10' },
  { _id: '4', name: 'Umbrella Co', domain: 'umbrella.example.com', email: 'admin@umbrella.com', plan: 'enterprise', status: 'active', users: 120, createdAt: '2024-11-01' },
  { _id: '5', name: 'Hooli', domain: 'hooli.example.com', email: 'admin@hooli.com', plan: 'professional', status: 'inactive', users: 15, createdAt: '2025-04-05' },
]

export default function AdminTenantsPage() {
  const [tenants, setTenants] = useState(initialTenants)
  const [showCreate, setShowCreate] = useState(false)
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({ name: '', domain: '', email: '', plan: 'starter' })
  const [isLoading, setIsLoading] = useState(false)

  const filtered = tenants.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.domain.toLowerCase().includes(search.toLowerCase())
  )

  const handleCreate = async () => {
    if (!form.name || !form.domain || !form.email) {
      toast.error('Please fill all required fields')
      return
    }
    setIsLoading(true)
    await new Promise(r => setTimeout(r, 800))
    const newTenant = { _id: String(Date.now()), ...form, status: 'active', users: 0, createdAt: new Date().toISOString() }
    setTenants(prev => [...prev, newTenant])
    setIsLoading(false)
    setShowCreate(false)
    setForm({ name: '', domain: '', email: '', plan: 'starter' })
    toast.success('Tenant created successfully')
  }

  const handleSuspend = async (id: string) => {
    setTenants(prev => prev.map(t => t._id === id ? { ...t, status: 'suspended' } : t))
    toast.success('Tenant suspended')
  }

  const handleActivate = async (id: string) => {
    setTenants(prev => prev.map(t => t._id === id ? { ...t, status: 'active' } : t))
    toast.success('Tenant activated')
  }

  if (isLoading) return <PageLoader />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tenants</h1>
          <p className="text-sm text-gray-500 mt-1">Manage multi-tenant organizations</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="h-4 w-4 mr-2" /> Create Tenant
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input placeholder="Search tenants..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Tenant</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Domain</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Plan</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Users</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Created</th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(tenant => (
                  <tr key={tenant._id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-primary-50 p-2">
                          <Building2 className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{tenant.name}</p>
                          <p className="text-xs text-gray-500">{tenant.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{tenant.domain}</td>
                    <td className="px-4 py-3 text-sm capitalize">{tenant.plan}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{tenant.users}</td>
                    <td className="px-4 py-3"><StatusBadge status={tenant.status} /></td>
                    <td className="px-4 py-3 text-sm text-gray-500">{formatDate(tenant.createdAt)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        {tenant.status === 'suspended' ? (
                          <Button variant="outline" size="sm" onClick={() => handleActivate(tenant._id)}>Activate</Button>
                        ) : (
                          <Button variant="ghost" size="sm" onClick={() => handleSuspend(tenant._id)}>Suspend</Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={7} className="h-32 text-center text-gray-500">No tenants found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create Tenant" size="lg">
        <div className="space-y-4">
          <Input label="Organization Name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Enter organization name" />
          <Input label="Domain" value={form.domain} onChange={e => setForm(p => ({ ...p, domain: e.target.value }))} placeholder="tenant.example.com" />
          <Input label="Admin Email" type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="admin@company.com" />
          <Select label="Plan" options={[
            { value: 'starter', label: 'Starter' },
            { value: 'professional', label: 'Professional' },
            { value: 'enterprise', label: 'Enterprise' },
          ]} value={form.plan} onChange={e => setForm(p => ({ ...p, plan: e.target.value }))} />
          <p className="text-sm text-gray-500">Use the API to connect this page.</p>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button onClick={handleCreate}>Create Tenant</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
