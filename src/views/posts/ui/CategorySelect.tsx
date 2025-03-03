import { CategoryItem } from '@/app/(app)/@sidebar/api/category';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui';

interface CategorySelectProps {
  selectedCategory: string;
  onCategorySelect: (value: string) => void;
  isLoading: boolean;
  error: Error | null;
  categories: CategoryItem[];
}

interface SelectStateConfig {
  disabled: boolean;
  placeholder: string;
  value: string;
  content: string;
}

export function CategorySelect({
  selectedCategory,
  onCategorySelect,
  isLoading,
  error,
  categories,
}: CategorySelectProps) {
  // 상태별 설정 정의
  const getStateConfig = (): SelectStateConfig => {
    if (isLoading) {
      return {
        disabled: true,
        placeholder: '카테고리 로딩 중...',
        value: 'loading',
        content: '로딩 중...',
      };
    }

    if (error) {
      return {
        disabled: true,
        placeholder: '카테고리 로드 실패',
        value: 'error',
        content: '카테고리를 불러오는 중 오류가 발생했습니다',
      };
    }

    if (categories.length === 0) {
      return {
        disabled: true,
        placeholder: '사용 가능한 카테고리 없음',
        value: 'empty',
        content: '사용 가능한 카테고리가 없습니다',
      };
    }

    return {
      disabled: false,
      placeholder: '게시판을 선택해주세요',
      value: selectedCategory,
      content: '',
    };
  };

  const config = getStateConfig();
  const isNormalState = !isLoading && !error && categories.length > 0;

  return (
    <Select
      disabled={config.disabled}
      value={config.value}
      onValueChange={isNormalState ? onCategorySelect : undefined}
    >
      <SelectTrigger className="focus:ring-ring">
        <SelectValue placeholder={config.placeholder} />
      </SelectTrigger>
      <SelectContent>
        {isNormalState ? (
          categories.map(category => (
            <SelectItem key={category.categoryCode} value={category.categoryCode} className="text-md h-14">
              {category.categoryName}
            </SelectItem>
          ))
        ) : (
          <SelectItem value={config.value} disabled>
            {config.content}
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  );
}
