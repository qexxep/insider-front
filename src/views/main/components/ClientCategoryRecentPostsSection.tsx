'use client';

import { MajorCategory } from '../api/category';
import { CategoryRecentPostsSection as OriginalCategoryRecentPostsSection } from './CategoryRecentPostsSection';

export function ClientCategoryRecentPostsSection({ recentPosts }: { recentPosts: MajorCategory[] }) {
  return <OriginalCategoryRecentPostsSection recentPosts={recentPosts} />;
}
