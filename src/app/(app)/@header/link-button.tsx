'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/shared/lib';

interface LinkButtonProps {
  href: string;
  label: string;
}

export const LinkButton = ({ href, label }: LinkButtonProps) => {
  const pathname = usePathname();
  const isActive = href === pathname;

  const handleRefresh = (href: string) => {
    if (pathname === href) {
      window.location.reload();
    }
  };

  return (
    <Link
      href={href}
      className={cn(
        'font-semibold text-[#4B4B4B] transition-colors',
        isActive && 'text-primary hover:font-bold hover:text-primary'
      )}
      onClick={() => handleRefresh(href)}
    >
      {label}
    </Link>
  );
};
