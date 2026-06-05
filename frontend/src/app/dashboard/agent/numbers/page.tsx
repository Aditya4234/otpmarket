'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'

export default function AgentNumbersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Numbers</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your phone numbers for OTP services</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Registered Numbers</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 text-center py-8">
            Manage your phone numbers here
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
