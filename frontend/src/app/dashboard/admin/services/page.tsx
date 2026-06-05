'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'

export default function AdminServicesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Services</h1>
        <p className="text-sm text-gray-500 mt-1">Manage OTP services</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Services</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 text-center py-8">
            Service management interface will be built here.
            Use the API layer at src/redux/api/serviceApi.ts to connect.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
