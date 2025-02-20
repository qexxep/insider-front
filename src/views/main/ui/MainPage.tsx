import React from 'react';

import { getCategoryRecentPosts } from '../api/category';
import { getRankings } from '../api/insider';
import { CategoryRecentPostsSection } from '../components/CategoryRecentPostsSection';
import { InsiderRankingSection } from '../components/InsiderRankingSection';
import { WeeklyDiscussionSection } from '../components/WeeklyDiscussionSection';

export async function MainPage() {
  const { data: rankings } = await getRankings();
  const { data: recentPosts } = await getCategoryRecentPosts();
  const DISCUSSION_ITEMS = [1, 2, 3, 4, 5, 6];

  return (
    <div className="mx-auto w-full max-w-full px-6 lg:px-0">
      {/* Weekly Discussion Section */}
      <WeeklyDiscussionSection discussionItems={DISCUSSION_ITEMS} />

      {/* Insider Ranking Section */}
      <InsiderRankingSection rankings={rankings} />

      {/* Category Recent Posts Section */}
      <CategoryRecentPostsSection recentPosts={recentPosts} />
    </div>
  );
}
