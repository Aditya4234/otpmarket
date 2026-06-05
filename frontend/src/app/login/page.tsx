'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useLoginMutation } from '@/redux/api/authApi'
import { useAppDispatch } from '@/redux/hooks'
import { setCredentials } from '@/redux/slices/authSlice'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Alert } from '@/components/ui/Alert'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [login, { isLoading }] = useLoginMutation()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    try {
      setError('')
      const result = await login(data).unwrap()
      dispatch(setCredentials(result.data!))
      toast.success('Login successful!')
      const role = result.data!.user.role
      router.push(`/dashboard/${role}`)
    } catch (err: any) {
      setError(err.data?.message || 'Login failed. Please try again.')
    }
  }

  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#050816] items-center justify-center">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-conic from-[#804dee] via-transparent to-transparent animate-spin-slow" />
        </div>
        <div className="relative z-10 text-center px-12">
          <div className="mb-8">
            <h1 className="text-5xl font-bold text-white tracking-widest">
              OTP<span className="text-[#804dee]">MART</span>
            </h1>
          </div>
          <p className="text-xl text-gray-300 mb-6 font-light">
            Your Trusted OTP Verification Service
          </p>
          <div className="space-y-4 text-gray-400">
            <div className="flex items-center gap-3 justify-center">
              <div className="h-px w-8 bg-[#804dee]" />
              <span>Fast & Reliable</span>
              <div className="h-px w-8 bg-[#804dee]" />
            </div>
            <div className="flex items-center gap-3 justify-center">
              <div className="h-px w-8 bg-[#804dee]" />
              <span>Secure & Private</span>
              <div className="h-px w-8 bg-[#804dee]" />
            </div>
            <div className="flex items-center gap-3 justify-center">
              <div className="h-px w-8 bg-[#804dee]" />
              <span>24/7 Support</span>
              <div className="h-px w-8 bg-[#804dee]" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="lg:hidden mb-6">
              <h1 className="text-3xl font-bold text-[#050816] tracking-widest">
                OTP<span className="text-[#804dee]">MART</span>
              </h1>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
            <p className="mt-2 text-gray-500">Sign in to your account to continue</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
            {error && (
              <Alert variant="error" className="mb-6" onClose={() => setError('')}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                icon={<Mail className="h-4 w-4" />}
                error={errors.email?.message}
                {...register('email')}
              />

              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  icon={<Lock className="h-4 w-4" />}
                  error={errors.password?.message}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              <div className="flex items-center justify-end">
                <Link href="/forgot-password" className="text-sm text-[#804dee] hover:text-[#6b3dc9] font-medium transition-colors">
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#804dee] hover:bg-[#6b3dc9] text-white shadow-lg shadow-[#804dee]/25"
                isLoading={isLoading}
              >
                Sign in
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-500 text-sm">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="text-[#804dee] hover:text-[#6b3dc9] font-medium transition-colors">
                  Create one
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
