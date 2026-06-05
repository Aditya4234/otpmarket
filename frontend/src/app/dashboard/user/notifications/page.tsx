'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'

export default function UserNotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        <p className="text-sm text-gray-500 mt-1">Stay updated with your activity</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 text-center py-8">
            Your notifications will appear here.
            Use the API layer at src/redux/slices/notificationSlice.ts to connect.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
