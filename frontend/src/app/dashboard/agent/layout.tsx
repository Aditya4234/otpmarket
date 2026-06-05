'use client'

import { DashboardLayout } from '@/components/layout/DashboardLayout'

export default function AgentDashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout allowedRoles={['agent']}>{children}</DashboardLayout>
}
