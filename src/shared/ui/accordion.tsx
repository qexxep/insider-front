'use client';

import * as AccordionPrimitive from '@radix-ui/react-accordion';
import * as React from 'react';

import { cn } from '@/shared/lib/tw-utils';

import { Icons } from './icons';

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item ref={ref} className={cn('border-b', className)} {...props} />
));
AccordionItem.displayName = 'AccordionItem';

interface AccordionTriggerProps extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> {
  children: React.ReactNode;
  iconPosition?: 'left' | 'right';
  iconClassName?: string;
  width?: 'full' | 'fit';
  showIcon?: boolean;
}

const AccordionTrigger = React.forwardRef<React.ElementRef<typeof AccordionPrimitive.Trigger>, AccordionTriggerProps>(
  ({ className, children, iconPosition = 'right', iconClassName, width = 'full', showIcon = true, ...props }, ref) => (
    <AccordionPrimitive.Header className={cn('flex', width === 'fit' && 'w-fit')}>
      <AccordionPrimitive.Trigger
        ref={ref}
        className={cn(
          'flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline',
          showIcon && '[&[data-state=open]>svg]:rotate-180',
          className
        )}
        {...props}
      >
        {showIcon && iconPosition === 'left' && (
          <Icons.chevronDown className={cn('h-4 w-4 shrink-0 transition-transform duration-200', iconClassName)} />
        )}
        {children}
        {showIcon && iconPosition === 'right' && (
          <Icons.chevronDown className={cn('h-4 w-4 shrink-0 transition-transform duration-200', iconClassName)} />
        )}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
);
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn('pb-4 pt-0', className)}>{children}</div>
  </AccordionPrimitive.Content>
));

AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
