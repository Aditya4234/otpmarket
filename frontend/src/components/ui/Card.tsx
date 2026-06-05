import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const Card = ({ children, className, padding = 'md' }: CardProps) => {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }

  return (
    <div
      className={cn(
        'rounded-lg border bg-card text-card-foreground shadow-sm',
        paddings[padding],
        className
      )}
    >
      {children}
    </div>
  )
}

const CardHeader = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn('flex flex-col space-y-1.5 pb-4', className)}>{children}</div>
)

const CardTitle = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <h3 className={cn('text-lg font-semibold leading-none tracking-tight', className)}>{children}</h3>
)

const CardDescription = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <p className={cn('text-sm text-muted-foreground', className)}>{children}</p>
)

const CardContent = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn('', className)}>{children}</div>
)

const CardFooter = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn('flex items-center pt-4', className)}>{children}</div>
)

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
