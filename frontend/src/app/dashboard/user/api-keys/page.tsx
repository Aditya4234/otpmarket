'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Alert } from '@/components/ui/Alert'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { PageLoader } from '@/components/ui/Spinner'
import { formatDate } from '@/lib/utils'
import { Key, Plus, Copy, Trash2, CheckCircle2, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'

interface ApiKey {
  _id: string
  name: string
  prefix: string
  createdAt: string
  lastUsedAt: string | null
  status: 'active' | 'revoked'
  permissions: string[]
}

const mockKeys: ApiKey[] = [
  { _id: '1', name: 'Production Key', prefix: 'otp_prod_4a8f...', createdAt: '2025-10-01T10:00:00Z', lastUsedAt: '2026-03-15T14:30:00Z', status: 'active', permissions: ['read', 'write'] },
  { _id: '2', name: 'Development Key', prefix: 'otp_dev_9b3c...', createdAt: '2026-01-10T08:00:00Z', lastUsedAt: '2026-03-10T11:00:00Z', status: 'active', permissions: ['read'] },
  { _id: '3', name: 'Testing Key', prefix: 'otp_test_7d2e...', createdAt: '2025-08-20T12:00:00Z', lastUsedAt: null, status: 'revoked', permissions: ['read', 'write', 'admin'] },
]

const allPermissions = [
  { value: 'read', label: 'Read — Access data and view resources' },
  { value: 'write', label: 'Write — Create and update resources' },
  { value: 'admin', label: 'Admin — Full access including deletion' },
]

export default function ApiKeysPage() {
  const [isLoading] = useState(false)
  const [keys, setKeys] = useState<ApiKey[]>(mockKeys)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showRevokeModal, setShowRevokeModal] = useState<string | null>(null)
  const [showNewKey, setShowNewKey] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', permissions: ['read'] as string[], expiry: '' })
  const [creating, setCreating] = useState(false)

  const togglePermission = (perm: string) => {
    setForm((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(perm)
        ? prev.permissions.filter((p) => p !== perm)
        : [...prev.permissions, perm],
    }))
  }

  const handleCreate = async () => {
    if (!form.name) { toast.error('Please enter a key name'); return }
    if (form.permissions.length === 0) { toast.error('Select at least one permission'); return }
    setCreating(true)
    await new Promise((r) => setTimeout(r, 1000))
    const newKeyValue = `otp_${Math.random().toString(36).substring(2, 10)}_${Math.random().toString(36).substring(2, 18)}`
    const newKey: ApiKey = {
      _id: Date.now().toString(),
      name: form.name,
      prefix: newKeyValue.substring(0, 12) + '...',
      createdAt: new Date().toISOString(),
      lastUsedAt: null,
      status: 'active',
      permissions: form.permissions,
    }
    setKeys((prev) => [newKey, ...prev])
    setShowNewKey(newKeyValue)
    setForm({ name: '', permissions: ['read'], expiry: '' })
    setCreating(false)
    toast.success('API key created')
  }

  const handleRevoke = async (id: string) => {
    await new Promise((r) => setTimeout(r, 500))
    setKeys((prev) => prev.map((k) => (k._id === id ? { ...k, status: 'revoked' as const } : k)))
    setShowRevokeModal(null)
    toast.success('API key revoked')
  }

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key)
    toast.success('API key copied to clipboard')
  }

  if (isLoading) return <PageLoader />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">API Keys</h1>
          <p className="text-sm text-gray-500 mt-1">Manage API keys for programmatic access</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create New Key
        </Button>
      </div>

      <Alert variant="warning">
        <AlertTriangle className="h-4 w-4" />
        API keys provide full access to your account. Keep them secure and never share them publicly.
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Your API Keys</CardTitle>
          <CardDescription>{keys.length} key{keys.length !== 1 ? 's' : ''} configured</CardDescription>
        </CardHeader>
        <CardContent>
          {keys.length > 0 ? (
            <div className="space-y-3">
              {keys.map((key) => (
                <div key={key._id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Key className="h-4 w-4 text-gray-400" />
                      <p className="text-sm font-medium text-gray-900">{key.name}</p>
                      <StatusBadge status={key.status} />
                    </div>
                    <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                      <span className="font-mono">{key.prefix}</span>
                      <span>·</span>
                      <span>Created {formatDate(key.createdAt, 'short')}</span>
                      {key.lastUsedAt && (
                        <>
                          <span>·</span>
                          <span>Last used {formatDate(key.lastUsedAt, 'relative')}</span>
                        </>
                      )}
                      {!key.lastUsedAt && (
                        <>
                          <span>·</span>
                          <span className="text-gray-400">Never used</span>
                        </>
                      )}
                    </div>
                    <div className="mt-1 flex gap-1">
                      {key.permissions.map((perm) => (
                        <span key={perm} className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                          {perm}
                        </span>
                      ))}
                    </div>
                  </div>
                  {key.status === 'active' && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => setShowRevokeModal(key._id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Revoke
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-8">
              No API keys yet. Create one to get started.
            </p>
          )}
        </CardContent>
      </Card>

      <Modal isOpen={showCreateModal} onClose={() => { if (!creating) { setShowCreateModal(false); setShowNewKey(null); setForm({ name: '', permissions: ['read'], expiry: '' }) } }} title="Create New API Key" size="lg">
        {showNewKey ? (
          <div className="space-y-4">
            <Alert variant="success">
              <CheckCircle2 className="h-4 w-4" />
              <div>
                <p className="font-medium">API Key Created</p>
                <p className="mt-1">Copy this key now. You won't be able to see it again.</p>
              </div>
            </Alert>
            <div className="relative">
              <Input
                value={showNewKey}
                readOnly
                className="font-mono text-sm pr-10"
              />
              <button
                onClick={() => copyKey(showNewKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
            <Button className="w-full" onClick={() => { setShowCreateModal(false); setShowNewKey(null); setForm({ name: '', permissions: ['read'], expiry: '' }) }}>
              Done
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Input
              label="Key Name"
              placeholder="e.g. Production Key"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
              <div className="space-y-2">
                {allPermissions.map((perm) => (
                  <label key={perm.value} className="flex items-start gap-3 rounded-lg border p-3 cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={form.permissions.includes(perm.value)}
                      onChange={() => togglePermission(perm.value)}
                      className="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{perm.label.split(' — ')[0]}</p>
                      <p className="text-xs text-gray-500">{perm.label.split(' — ')[1]}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <Input
              label="Expiry (optional)"
              type="date"
              value={form.expiry}
              onChange={(e) => setForm({ ...form, expiry: e.target.value })}
            />

            <Button className="w-full" onClick={handleCreate} isLoading={creating}>
              <Plus className="h-4 w-4 mr-2" />
              Create API Key
            </Button>
          </div>
        )}
      </Modal>

      <Modal isOpen={!!showRevokeModal} onClose={() => setShowRevokeModal(null)} title="Revoke API Key" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to revoke this API key? Any applications using this key will immediately lose access.
          </p>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setShowRevokeModal(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              className="flex-1"
              onClick={() => showRevokeModal && handleRevoke(showRevokeModal)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Revoke
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
