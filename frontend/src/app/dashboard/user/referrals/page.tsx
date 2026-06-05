'use client'

import { useState, useCallback } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { PageLoader } from '@/components/ui/Spinner'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Copy, CheckCircle2, Users, DollarSign, Percent, Share2 } from 'lucide-react'
import toast from 'react-hot-toast'

const mockReferrals = [
  { _id: '1', name: 'John Doe', email: 'john@example.com', joinedAt: '2025-12-01T10:00:00Z', status: 'active', earnings: 25.00 },
  { _id: '2', name: 'Jane Smith', email: 'jane@example.com', joinedAt: '2025-11-20T08:30:00Z', status: 'active', earnings: 50.00 },
  { _id: '3', name: 'Bob Wilson', email: 'bob@example.com', joinedAt: '2025-10-15T14:00:00Z', status: 'inactive', earnings: 10.00 },
  { _id: '4', name: 'Alice Brown', email: 'alice@example.com', joinedAt: '2026-01-05T09:00:00Z', status: 'active', earnings: 75.00 },
  { _id: '5', name: 'Charlie Davis', email: 'charlie@example.com', joinedAt: '2026-02-10T16:00:00Z', status: 'active', earnings: 30.00 },
]

export default function ReferralsPage() {
  const [isLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const referralCode = 'REF-OTPMART-ABC123'
  const referralLink = `https://otpmart.com/ref/${referralCode}`
  const commissionRate = 10
  const stats = {
    totalReferrals: mockReferrals.length,
    activeReferrals: mockReferrals.filter((r) => r.status === 'active').length,
    totalEarnings: mockReferrals.reduce((sum, r) => sum + r.earnings, 0),
    commissionRate: 10,
  }

  const copyToClipboard = useCallback(async (text: string, label: string) => {
    await navigator.clipboard.writeText(text)
    toast.success(`${label} copied to clipboard`)
  }, [])

  const copyReferralCode = useCallback(() => {
    copyToClipboard(referralCode, 'Referral code')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [copyToClipboard, referralCode])

  const shareReferral = useCallback(async () => {
    if (navigator.share) {
      await navigator.share({ title: 'Join OTPMart', text: `Use my referral code ${referralCode} to sign up!`, url: referralLink })
    } else {
      copyToClipboard(referralLink, 'Referral link')
    }
  }, [copyToClipboard, referralCode, referralLink])

  if (isLoading) return <PageLoader />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Referral Program</h1>
        <p className="text-sm text-gray-500 mt-1">Invite friends and earn commission on their orders</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
                <Users className="h-6 w-6" />
              </div>
            </div>
            <p className="mt-4 text-2xl font-bold text-gray-900">{stats.totalReferrals}</p>
            <p className="mt-1 text-sm text-gray-500">Total Referrals</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-green-50 p-3 text-green-600">
                <CheckCircle2 className="h-6 w-6" />
              </div>
            </div>
            <p className="mt-4 text-2xl font-bold text-gray-900">{stats.activeReferrals}</p>
            <p className="mt-1 text-sm text-gray-500">Active Referrals</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-purple-50 p-3 text-purple-600">
                <DollarSign className="h-6 w-6" />
              </div>
            </div>
            <p className="mt-4 text-2xl font-bold text-gray-900">{formatCurrency(stats.totalEarnings)}</p>
            <p className="mt-1 text-sm text-gray-500">Total Earnings</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-orange-50 p-3 text-orange-600">
                <Percent className="h-6 w-6" />
              </div>
            </div>
            <p className="mt-4 text-2xl font-bold text-gray-900">{commissionRate}%</p>
            <p className="mt-1 text-sm text-gray-500">Commission Rate</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Referral Code</CardTitle>
          <CardDescription>Share this code with friends to earn commission</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Input
                  value={referralCode}
                  readOnly
                  className="font-mono text-base font-bold text-center"
                />
              </div>
              <Button variant="outline" size="sm" onClick={copyReferralCode}>
                {copied ? (
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                ) : (
                  <Copy className="h-4 w-4 mr-1" />
                )}
                {copied ? 'Copied' : 'Copy'}
              </Button>
              <Button size="sm" onClick={shareReferral}>
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Input
                  value={referralLink}
                  readOnly
                  className="text-sm text-gray-600"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(referralLink, 'Referral link')}
              >
                <Copy className="h-4 w-4 mr-1" />
                Copy Link
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Referral History</CardTitle>
          <CardDescription>People who joined using your referral code</CardDescription>
        </CardHeader>
        <CardContent>
          {mockReferrals.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Joined</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Earnings</th>
                  </tr>
                </thead>
                <tbody>
                  {mockReferrals.map((referral) => (
                    <tr key={referral._id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{referral.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{referral.email}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{formatDate(referral.joinedAt, 'short')}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={referral.status} />
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">
                        {formatCurrency(referral.earnings)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-8">
              No referrals yet. Start sharing your code!
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
