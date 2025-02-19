'use client';

import { InsiderRanking } from '../api/insider';
import { InsiderRankingSection as OriginalInsiderRankingSection } from './InsiderRankingSection';

export function ClientInsiderRankingSection({ rankings }: { rankings: InsiderRanking[] }) {
  return <OriginalInsiderRankingSection rankings={rankings} />;
}
