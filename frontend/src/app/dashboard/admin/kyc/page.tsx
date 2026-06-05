'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { PageLoader } from '@/components/ui/Spinner'
import { formatDate } from '@/lib/utils'
import { Eye, CheckCircle, XCircle, FileText, Search } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import toast from 'react-hot-toast'

const submissions = [
  { _id: '1', name: 'Rahul Sharma', email: 'rahul@example.com', type: 'aadhaar', status: 'pending', submittedAt: '2025-05-20', documents: ['aadhaar-front.jpg', 'aadhaar-back.jpg'] },
  { _id: '2', name: 'Priya Patel', email: 'priya@example.com', type: 'pan', status: 'verified', submittedAt: '2025-05-18', documents: ['pan-card.jpg'] },
  { _id: '3', name: 'Amit Singh', email: 'amit@example.com', type: 'business', status: 'rejected', submittedAt: '2025-05-15', documents: ['gst-cert.pdf', 'business-license.pdf'], rejectReason: 'Documents unclear' },
  { _id: '4', name: 'Sneha Gupta', email: 'sneha@example.com', type: 'aadhaar', status: 'pending', submittedAt: '2025-05-22', documents: ['aadhaar-front.jpg'] },
  { _id: '5', name: 'Vikram Reddy', email: 'vikram@example.com', type: 'pan', status: 'verified', submittedAt: '2025-05-10', documents: ['pan-card.jpg'] },
]

export default function AdminKycPage() {
  const [kycList, setKycList] = useState(submissions)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<any>(null)
  const [showDetail, setShowDetail] = useState(false)
  const [loading, setLoading] = useState(false)

  const filtered = kycList.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  )

  const handleVerify = async (id: string) => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    setKycList(prev => prev.map(s => s._id === id ? { ...s, status: 'verified' } : s))
    setShowDetail(false)
    setLoading(false)
    toast.success('KYC verified successfully')
  }

  const handleReject = async (id: string) => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    setKycList(prev => prev.map(s => s._id === id ? { ...s, status: 'rejected', rejectReason: 'Rejected by admin' } : s))
    setShowDetail(false)
    setLoading(false)
    toast.success('KYC rejected')
  }

  if (loading) return <PageLoader />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">KYC Submissions</h1>
        <p className="text-sm text-gray-500 mt-1">Verify user identity documents</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Applicant</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Submitted</th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(sub => (
                  <tr key={sub._id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-900">{sub.name}</p>
                      <p className="text-xs text-gray-500">{sub.email}</p>
                    </td>
                    <td className="px-4 py-3 text-sm capitalize">{sub.type}</td>
                    <td className="px-4 py-3"><StatusBadge status={sub.status} /></td>
                    <td className="px-4 py-3 text-sm text-gray-500">{formatDate(sub.submittedAt)}</td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="sm" onClick={() => { setSelected(sub); setShowDetail(true) }}>
                        <Eye className="h-4 w-4 mr-1" /> View
                      </Button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={5} className="h-32 text-center text-gray-500">No submissions found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Modal isOpen={showDetail} onClose={() => setShowDetail(false)} title="KYC Details" size="lg">
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Name</p>
                <p className="text-sm">{selected.name}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Email</p>
                <p className="text-sm">{selected.email}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Document Type</p>
                <p className="text-sm capitalize">{selected.type}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Status</p>
                <StatusBadge status={selected.status} />
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-gray-500 uppercase mb-2">Documents</p>
              <div className="space-y-2">
                {selected.documents.map((doc: string, i: number) => (
                  <div key={i} className="flex items-center gap-2 rounded-lg border p-3">
                    <FileText className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-700">{doc}</span>
                    <Button variant="ghost" size="sm" className="ml-auto">View</Button>
                  </div>
                ))}
              </div>
            </div>

            {selected.rejectReason && (
              <div className="rounded-lg bg-red-50 p-3">
                <p className="text-xs font-medium text-red-700">Rejection Reason</p>
                <p className="text-sm text-red-600 mt-1">{selected.rejectReason}</p>
              </div>
            )}

            <p className="text-sm text-gray-500">Use the API to connect this page.</p>

            {selected.status === 'pending' && (
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="danger" onClick={() => handleReject(selected._id)}>
                  <XCircle className="h-4 w-4 mr-2" /> Reject
                </Button>
                <Button onClick={() => handleVerify(selected._id)}>
                  <CheckCircle className="h-4 w-4 mr-2" /> Verify
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
