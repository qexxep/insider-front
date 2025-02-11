import { Icons } from '../ui';

// Icon Mapping
const iconMap: Record<string, keyof typeof Icons> = {
  취업: 'building2',
  연애: 'heart',
  연예: 'smile',
  경제: 'wallet',
  정치: 'landPlot',
  스포츠: 'dumbbell',
  사회: 'users',
  익명자유: 'smile',
  익명고민: 'helpCircle',
  반려동물: 'dog',
  무한위로: 'handshake',
  응원합시다: 'users',
};

// Icon Component
export function CategoryIcon({ categoryName, className = 'h-4 w-4' }: { categoryName: string; className?: string }) {
  const IconComponent = Icons[iconMap[categoryName] ?? 'circle'];
  return <IconComponent className={className} />;
}
