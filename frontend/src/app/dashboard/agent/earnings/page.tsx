'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'

export default function AgentEarningsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Earnings</h1>
        <p className="text-sm text-gray-500 mt-1">Track your earnings from OTP services</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Earnings History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 text-center py-8">
            Your earnings breakdown will appear here.
            Use the API layer at src/redux/api/walletApi.ts to connect.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
