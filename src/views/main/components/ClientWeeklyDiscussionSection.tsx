'use client';

import { WeeklyDiscussionSection as OriginalWeeklyDiscussionSection } from './WeeklyDiscussionSection';

export function ClientWeeklyDiscussionSection({ discussionItems }: { discussionItems: number[] }) {
  return <OriginalWeeklyDiscussionSection discussionItems={discussionItems} />;
}
