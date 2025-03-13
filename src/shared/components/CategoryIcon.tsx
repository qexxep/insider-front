import { cn } from '@/shared/lib';
import { Icons } from '@/shared/ui';

// Icon Mapping
const iconMap: Record<string, keyof typeof Icons> = {
  취업: 'career',
  연애: 'dating',
  경제: 'economy',
  정치: 'politics',
  스포츠: 'sports',
  사회: 'society',
  익명자유: 'anonymousFree',
  익명고민: 'anonymousWorry',
  반려동물: 'pets',
  무한위로: 'comfort',
  응원합시다: 'cheer',
  명예의전당: 'honor',
};

interface CategoryIconProps {
  categoryName: string;
  className?: string;
}

// Icon Component
export function CategoryIcon({ categoryName, className }: CategoryIconProps) {
  const IconComponent = Icons[iconMap[categoryName] ?? 'circle'];
  return <IconComponent className={cn('h-4 w-4', className)} />;
}
