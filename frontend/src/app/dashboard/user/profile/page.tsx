'use client'

import { useAppSelector, useAppDispatch } from '@/redux/hooks'
import { setUser } from '@/redux/slices/authSlice'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useUpdateProfileMutation } from '@/redux/api/userApi'
import { useRouter } from 'next/navigation'

export default function UserProfilePage() {
  const { user } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [name, setName] = useState(user?.name || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [updateProfile, { isLoading }] = useUpdateProfileMutation()

  const handleSave = async () => {
    try {
      const result = await updateProfile({ name, phone }).unwrap()
      if (result.data?.user) {
        dispatch(setUser(result.data.user))
      }
      toast.success('Profile updated successfully')
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to update profile')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your personal information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Avatar name={user?.name || 'User'} size="lg" className="mx-auto" />
            <h3 className="mt-4 text-lg font-semibold">{user?.name}</h3>
            <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
              <Input label="Email" value={user?.email || ''} disabled />
              <Input label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
              <Button onClick={handleSave} isLoading={isLoading}>Save Changes</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" onClick={() => router.push('/dashboard/user/account')}>
                Manage Account Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
