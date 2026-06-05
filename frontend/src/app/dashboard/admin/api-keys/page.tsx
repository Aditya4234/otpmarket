'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Modal } from '@/components/ui/Modal'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { formatDate } from '@/lib/utils'
import { Key, Plus, Copy, Trash2, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

const initialKeys = [
  { _id: '1', name: 'Production API Key', key: 'sk_live_*********************', lastUsed: '2025-05-25', status: 'active', created: '2025-01-10' },
  { _id: '2', name: 'Development Key', key: 'sk_test_*********************', lastUsed: '2025-05-20', status: 'active', created: '2025-02-15' },
  { _id: '3', name: 'Staging Key', key: 'sk_test_*********************', lastUsed: '2025-04-30', status: 'revoked', created: '2025-03-01' },
]

export default function AdminApiKeysPage() {
  const [apiKeys, setApiKeys] = useState(initialKeys)
  const [showCreate, setShowCreate] = useState(false)
  const [showKey, setShowKey] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', permission: 'read_write' })
  const [rawKey, setRawKey] = useState('')

  const handleCreate = () => {
    if (!form.name) { toast.error('Please enter a key name'); return }
    const generated = `sk_${Math.random().toString(36).substring(2, 30)}`
    setRawKey(generated)
    const newKey = {
      _id: String(Date.now()),
      name: form.name,
      key: generated,
      lastUsed: '-',
      status: 'active',
      created: new Date().toISOString(),
    }
    setApiKeys(prev => [...prev, newKey])
    toast.success('API key created. Copy it now - you won\'t see it again!')
  }

  const handleCopy = (key: string) => {
    navigator.clipboard.writeText(key)
    toast.success('Copied to clipboard')
  }

  const handleRevoke = (id: string) => {
    setApiKeys(prev => prev.map(k => k._id === id ? { ...k, status: 'revoked' } : k))
    toast.success('API key revoked')
  }

  const handleCloseCreate = () => {
    setShowCreate(false)
    setForm({ name: '', permission: 'read_write' })
    setRawKey('')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">API Keys</h1>
          <p className="text-sm text-gray-500 mt-1">Manage API keys for programmatic access</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="h-4 w-4 mr-2" /> Create Key
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Key</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Last Used</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Created</th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {apiKeys.map(ak => (
                  <tr key={ak._id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-primary-50 p-2">
                          <Key className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">{ak.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {showKey === ak._id ? ak.key : ak.key.slice(0, 12) + '...'}
                        </code>
                        <button onClick={() => setShowKey(showKey === ak._id ? null : ak._id)} className="text-gray-400 hover:text-gray-600">
                          {showKey === ak._id ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={ak.status} /></td>
                    <td className="px-4 py-3 text-sm text-gray-500">{ak.lastUsed}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{formatDate(ak.created)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleCopy(ak.key)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                        {ak.status === 'active' && (
                          <Button variant="ghost" size="sm" onClick={() => handleRevoke(ak._id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Modal isOpen={showCreate} onClose={handleCloseCreate} title="Create API Key" size="md">
        <div className="space-y-4">
          {rawKey ? (
            <div className="space-y-4">
              <div className="rounded-lg bg-green-50 p-4">
                <p className="text-sm font-medium text-green-800">Your API key has been created!</p>
                <p className="text-xs text-green-600 mt-1">Copy this key now. You won't be able to see it again.</p>
              </div>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-xs bg-gray-100 p-3 rounded break-all">{rawKey}</code>
                <Button size="sm" onClick={() => handleCopy(rawKey)}>
                  <Copy className="h-4 w-4 mr-1" /> Copy
                </Button>
              </div>
              <Button className="w-full" onClick={handleCloseCreate}>Done</Button>
            </div>
          ) : (
            <>
              <Input label="Key Name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Production Key" />
              <Select label="Permissions" options={[
                { value: 'read_only', label: 'Read Only' },
                { value: 'read_write', label: 'Read & Write' },
                { value: 'full_access', label: 'Full Access' },
              ]} value={form.permission} onChange={e => setForm(p => ({ ...p, permission: e.target.value }))} />
              <p className="text-sm text-gray-500">Use the API to connect this page.</p>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={handleCloseCreate}>Cancel</Button>
                <Button onClick={handleCreate}>Generate Key</Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  )
}
