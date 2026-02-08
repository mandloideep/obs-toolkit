import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

export const FormInput = forwardRef<HTMLInputElement, React.ComponentProps<typeof Input>>(
  ({ className, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        className={cn('bg-black/30 focus-visible:ring-brand-indigo/50', className)}
        {...props}
      />
    )
  }
)

FormInput.displayName = 'FormInput'
