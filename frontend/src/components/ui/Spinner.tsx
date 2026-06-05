import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const Spinner = ({ size = 'md', className }: SpinnerProps) => {
  const sizes = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' }

  return (
    <Loader2 className={cn('animate-spin text-primary', sizes[size], className)} />
  )
}

const PageLoader = () => (
  <div className="flex h-64 items-center justify-center">
    <Spinner size="lg" />
  </div>
)

export { Spinner, PageLoader }
