'use client';

import { EyeIcon, EyeOffIcon } from 'lucide-react';
import React, { forwardRef, useState } from 'react';

import { cn } from '../lib';
import { Button } from './button';
import { Input } from './input';

const PasswordInput = forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(({ className, ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        type={showPassword ? 'text' : 'password'}
        className={cn('hide-password-toggle pr-10', className)}
        ref={ref}
        {...props}
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="absolute right-0 top-0 h-full px-4 py-2 hover:bg-transparent [&_svg]:size-6"
        onClick={() => setShowPassword(prev => !prev)}
      >
        {showPassword ? (
          <EyeOffIcon className="h-6 w-6 text-gray-600" aria-hidden="true" />
        ) : (
          <EyeIcon className="h-6 w-6 text-gray-600" aria-hidden="true" />
        )}
        <span className="sr-only">{showPassword ? 'Hide password' : 'Show password'}</span>
      </Button>
      <style>{`.hide-password-toggle::-ms-reveal,.hide-password-toggle::-ms-clear {visibility: hidden;pointer-events: none; display: none;}`}</style>
    </div>
  );
});

PasswordInput.displayName = 'PasswordInput';

export { PasswordInput };
