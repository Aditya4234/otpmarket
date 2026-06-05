import { cn } from '@/lib/utils'
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react'

interface AlertProps {
  children: React.ReactNode
  variant?: 'info' | 'success' | 'warning' | 'error'
  className?: string
  onClose?: () => void
}

const Alert = ({ children, variant = 'info', className, onClose }: AlertProps) => {
  const icons = {
    info: Info,
    success: CheckCircle2,
    warning: AlertTriangle,
    error: AlertCircle,
  }

  const styles = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    error: 'bg-red-50 border-red-200 text-red-800',
  }

  const Icon = icons[variant]

  return (
    <div className={cn('flex items-start gap-3 rounded-lg border p-4', styles[variant], className)}>
      <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
      <div className="flex-1 text-sm">{children}</div>
      {onClose && (
        <button onClick={onClose} className="flex-shrink-0 rounded-md p-1 hover:opacity-70">
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

export { Alert }
