'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRegisterMutation } from '@/redux/api/authApi'
import { useAppDispatch } from '@/redux/hooks'
import { setCredentials } from '@/redux/slices/authSlice'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Alert } from '@/components/ui/Alert'
import { Mail, Lock, User, Phone, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Enter a valid phone number'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  role: z.enum(['user', 'agent']),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

type RegisterForm = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [register, { isLoading }] = useRegisterMutation()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const { register: formRegister, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'user' },
  })

  const onSubmit = async (data: RegisterForm) => {
    try {
      setError('')
      const { confirmPassword, ...payload } = data
      const result = await register(payload).unwrap()
      dispatch(setCredentials(result.data!))
      toast.success('Registration successful!')
      const role = result.data!.user.role
      router.push(`/dashboard/${role}`)
    } catch (err: any) {
      setError(err.data?.message || 'Registration failed. Please try again.')
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
            Start Your Journey Today
          </p>
          <div className="space-y-4 text-gray-400">
            <div className="flex items-center gap-3 justify-center">
              <div className="h-px w-8 bg-[#804dee]" />
              <span>Buy OTP Services</span>
              <div className="h-px w-8 bg-[#804dee]" />
            </div>
            <div className="flex items-center gap-3 justify-center">
              <div className="h-px w-8 bg-[#804dee]" />
              <span>Sell as Agent</span>
              <div className="h-px w-8 bg-[#804dee]" />
            </div>
            <div className="flex items-center gap-3 justify-center">
              <div className="h-px w-8 bg-[#804dee]" />
              <span>Earn Revenue</span>
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
            <h2 className="text-2xl font-bold text-gray-900">Create account</h2>
            <p className="mt-2 text-gray-500">Join OTPMart and get started</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
            {error && (
              <Alert variant="error" className="mb-6" onClose={() => setError('')}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <Input
                label="Full Name"
                placeholder="John Doe"
                icon={<User className="h-4 w-4" />}
                error={errors.name?.message}
                {...formRegister('name')}
              />

              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                icon={<Mail className="h-4 w-4" />}
                error={errors.email?.message}
                {...formRegister('email')}
              />

              <Input
                label="Phone"
                type="tel"
                placeholder="+91 9876543210"
                icon={<Phone className="h-4 w-4" />}
                error={errors.phone?.message}
                {...formRegister('phone')}
              />

              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password"
                  icon={<Lock className="h-4 w-4" />}
                  error={errors.password?.message}
                  {...formRegister('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              <Input
                label="Confirm Password"
                type="password"
                placeholder="Confirm your password"
                icon={<Lock className="h-4 w-4" />}
                error={errors.confirmPassword?.message}
                {...formRegister('confirmPassword')}
              />

              <Select
                label="I want to"
                options={[
                  { value: 'user', label: 'Buy OTP Services' },
                  { value: 'agent', label: 'Sell OTP as Agent' },
                ]}
                error={errors.role?.message}
                {...formRegister('role')}
              />

              <Button
                type="submit"
                className="w-full bg-[#804dee] hover:bg-[#6b3dc9] text-white shadow-lg shadow-[#804dee]/25"
                isLoading={isLoading}
              >
                Create account
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-500 text-sm">
                Already have an account?{' '}
                <Link href="/login" className="text-[#804dee] hover:text-[#6b3dc9] font-medium transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
