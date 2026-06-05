'use client'

import { useState } from 'react'
import { useGetAgentsQuery, useVerifyAgentMutation } from '@/redux/api/adminApi'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Avatar } from '@/components/ui/Avatar'
import { PageLoader } from '@/components/ui/Spinner'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function AdminAgentsPage() {
  const [page] = useState(1)
  const { data, isLoading } = useGetAgentsQuery({ page, limit: 10 })
  const [verifyAgent] = useVerifyAgentMutation()

  const handleVerify = async (id: string, isVerified: boolean) => {
    try {
      await verifyAgent({ id, isVerified: !isVerified }).unwrap()
      toast.success(`Agent ${isVerified ? 'unverified' : 'verified'} successfully`)
    } catch {
      toast.error('Failed to update verification status')
    }
  }

  if (isLoading) return <PageLoader />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Agents</h1>
        <p className="text-sm text-gray-500 mt-1">Manage OTP service providers</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Agent</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Phone</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Verified</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Joined</th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.data?.map((agent: any) => (
                  <tr key={agent._id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={agent.name} src={agent.avatar} size="sm" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{agent.name}</p>
                          <p className="text-xs text-gray-500">{agent.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{agent.phone}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={agent.isVerified ? 'verified' : 'unverified'} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={agent.isActive ? 'active' : 'inactive'} />
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {formatDate(agent.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <Button
                        variant={agent.isVerified ? 'outline' : 'ghost'}
                        size="sm"
                        onClick={() => handleVerify(agent._id, agent.isVerified)}
                      >
                        {agent.isVerified ? 'Unverify' : 'Verify'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
