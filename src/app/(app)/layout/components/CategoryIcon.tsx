import { Icons } from '@/shared/ui';

import { iconMap } from '../lib/iconMapping';

interface CategoryIconProps {
  categoryName: string;
  className?: string;
}

export function CategoryIcon({ categoryName, className = 'h-4 w-4' }: CategoryIconProps) {
  const IconComponent = Icons[iconMap[categoryName] ?? 'circle'];
  return <IconComponent className={className} />;
}
