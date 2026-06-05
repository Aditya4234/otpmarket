'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'

export default function AgentOtpLogsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">OTP Logs</h1>
        <p className="text-sm text-gray-500 mt-1">View OTP delivery logs</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Log History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 text-center py-8">
            OTP delivery logs will appear here
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
