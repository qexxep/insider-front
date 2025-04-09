import { http, HttpResponse } from 'msw';

import rankingsData from './response/rankings.json';
import recentPostsData from './response/recentPosts.json';

export const handlers = [
  // Mock the rankings API
  http.get('*/mains/insider/rankings', () => {
    return HttpResponse.json({
      data: rankingsData,
    });
  }),

  // Mock the category recent posts API
  http.get('*/mains/categories/recent-posts', () => {
    return HttpResponse.json({
      data: recentPostsData,
    });
  }),
];
