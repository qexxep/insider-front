import RankingLine from '../../../../public/icons/card_line.svg';
import First from '../../../../public/icons/first.svg';
import Loading from '../../../../public/icons/loading.svg';
import Second from '../../../../public/icons/second.svg';
import Third from '../../../../public/icons/third.svg';

export { Loading };

// 랭킹 관련 아이콘
export const RankIcons = {
  RankingLine,
  1: First,
  2: Second,
  3: Third,
} as const;

// 필요한 경우 편의를 위한 타입 정의
export type RankIconType = typeof RankIcons;
export type RankIconKeys = keyof typeof RankIcons;
