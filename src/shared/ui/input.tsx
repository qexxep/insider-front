import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '../lib';

const inputVariants = cva(
  cn(
    'flex h-12 w-full rounded-[6px] border bg-background px-3 py-2 text-[16px] text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground',
    'focus-visible:border-primary focus-visible:bg-[#FFEEE4] focus-visible:text-[#242424] focus-visible:outline-none focus-visible:ring-0',
    'disabled:cursor-not-allowed disabled:opacity-50'
  ),
  {
    variants: {
      status: {
        default: 'bg-background border-[#8F8F8F]',
        success: 'border-input-success text-input-success',
        error: 'border-[#FF4200] text-[#F04438]',
        warning: 'border-input-warning text-input-warning',
      },
    },
    defaultVariants: {
      status: 'default',
    },
  }
);

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, status, type, ...props }, ref) => {
  return <input type={type} className={cn(inputVariants({ status }), className)} ref={ref} {...props} />;
});
Input.displayName = 'Input';

export { Input };
