import { cn } from '@/shared/lib/tw-utils';

import { Icons } from './icons';

interface EmptyDataProps {
  message?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const EmptyData = ({
  message = '데이터가 없습니다.',
  icon = <Icons.file className="h-12 w-12 text-gray-400" />,
  className,
}: EmptyDataProps) => {
  return (
    <div className={cn('flex h-full w-full flex-col items-center justify-center gap-4 py-8', className)}>
      {icon}
      <p className="text-lg text-gray-900">{message}</p>
    </div>
  );
};
