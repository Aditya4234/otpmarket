'use client'

import { useAppSelector, useAppDispatch } from '@/redux/hooks'
import { setUser } from '@/redux/slices/authSlice'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useUpdateProfileMutation, useChangePasswordMutation } from '@/redux/api/userApi'
import { ShieldCheck, Mail, Calendar, Key } from 'lucide-react'

export default function UserAccountPage() {
  const { user } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()
  const [name, setName] = useState(user?.name || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation()
  const [changePassword, { isLoading: isChangingPwd }] = useChangePasswordMutation()

  const handleSaveInfo = async () => {
    try {
      const result = await updateProfile({ name, phone }).unwrap()
      if (result.data?.user) {
        dispatch(setUser(result.data.user))
      }
      toast.success('Account information updated successfully')
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to update account')
    }
  }

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match')
      return
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    try {
      await changePassword({ currentPassword, newPassword }).unwrap()
      toast.success('Password changed successfully. Please login again.')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to change password')
    }
  }

  const getStatusBadge = (verified: boolean) => {
    return verified
      ? <Badge variant="success">Verified</Badge>
      : <Badge variant="warning">Unverified</Badge>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Account</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your account settings and security</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Account Status</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Email</span>
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-gray-400" />
                    <span>{user?.email}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Email Verified</span>
                  {getStatusBadge(user?.isVerified || false)}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Phone Verified</span>
                  {getStatusBadge(user?.isPhoneVerified || false)}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Account Active</span>
                  {user?.isActive
                    ? <Badge variant="success">Active</Badge>
                    : <Badge variant="danger">Inactive</Badge>}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Role</span>
                  <Badge variant="info" className="capitalize">{user?.role}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Member Since</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-gray-400" />
                    <span>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                label="Email"
                value={user?.email || ''}
                disabled
              />
              <Input
                label="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <Button onClick={handleSaveInfo} isLoading={isUpdating}>
                Save Changes
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Current Password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <Input
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <Input
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <Button onClick={handleChangePassword} isLoading={isChangingPwd}>
                <Key className="h-4 w-4 mr-2" />
                Change Password
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
