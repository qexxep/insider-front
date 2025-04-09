import { expect, test } from '@playwright/test';

import rankings from '../__mocks__/response/rankings.json';
import recentPosts from '../__mocks__/response/recentPosts.json';

// 테스트에서 사용할 기본 URL 정의
const BASE_URL = 'http://localhost:3000';

test.describe('메인 페이지 테스트', () => {
  test.beforeEach(async ({ page }) => {
    // 페이지 탐색 전에 API 응답 모킹
    await page.route('**/mains/insider/rankings', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: rankings }),
      });
    });

    await page.route('**/mains/categories/recent-posts', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: recentPosts }),
      });
    });

    // 절대 URL을 사용하여 메인 페이지로 이동
    await page.goto(BASE_URL);

    // 페이지가 안정화될 때까지 대기
    await page.waitForLoadState('networkidle');
  });

  test('메인 페이지가 모든 주요 섹션을 올바르게 렌더링하는지 확인', async ({ page }) => {
    // 모든 주요 섹션이 존재하는지 확인 - 더 구체적인 선택자 사용
    const discussionSection = page.locator('h2.text-lg.font-bold:has-text("이번주 토론 주제")');
    const rankingSection = page.locator('h2.mb-2.text-xl.font-bold:has-text("인싸이더 랭킹")');
    // 첫 번째 카테고리 섹션 제목 선택 (인싸이더 게시판)
    const categorySection = page.locator('h2.mb-4.mt-10.text-xl.font-bold').first();

    await expect(discussionSection).toBeVisible();
    await expect(rankingSection).toBeVisible();
    await expect(categorySection).toBeVisible();

    // Shadcn Carousel 컴포넌트가 존재하는지 확인 - 더 구체적인 선택자 사용
    const carousel = page.locator('div[role="region"][aria-roledescription="carousel"]');
    await expect(carousel).toBeVisible();

    // Shadcn Card 컴포넌트를 사용한 랭킹 카드 섹션이 존재하는지 확인
    const rankingCards = page.locator('.mb-8.grid');
    await expect(rankingCards).toBeVisible();

    // 카테고리 카드 섹션이 존재하는지 확인
    const categoryCards = page.locator('.grid.grid-cols-2.gap-5');
    await expect(categoryCards).toBeVisible();
  });

  test('API 데이터가 UI에 올바르게 렌더링되는지 확인', async ({ page }) => {
    // 테스트 접근 방식: 요소 수가 예상 데이터 길이와 일치하는지 확인하고
    // 샘플 데이터가 올바르게 표시되는지 확인

    // 1. 랭킹 카드 수가 목업 데이터 길이와 일치하는지 확인
    const rankingCards = page.locator('.mb-8.grid > *');
    await expect(rankingCards).toHaveCount(rankings.length);

    // 2. 첫 번째 랭킹 카드에 올바른 데이터가 포함되어 있는지 확인
    const firstRankCard = rankingCards.first();
    await expect(firstRankCard).toContainText(rankings[0].postTitle);
    await expect(firstRankCard).toContainText(rankings[0].categoryName);

    // 3. 카테고리 섹션이 목업 데이터와 일치하는지 확인
    // 빈 카테고리 필터링
    const nonEmptyCategories = recentPosts[0].categoryList.filter(
      category => category.recentPostList && category.recentPostList.length > 0
    );

    const categoryCards = page.locator('.grid.grid-cols-2.gap-5 > *');
    await expect(categoryCards).toHaveCount(nonEmptyCategories.length);

    // 4. 샘플 카테고리 카드에 올바른 데이터가 포함되어 있는지 확인
    const sampleCategory = nonEmptyCategories[0];
    const samplePost = sampleCategory.recentPostList[0];

    // 이 카테고리 이름을 포함하는 카드 찾기
    const categoryCard = page.locator('div').filter({ hasText: sampleCategory.categoryName }).first();
    await expect(categoryCard).toContainText(samplePost.postTitle);
  });

  test('API 요청 실패가 우아하게 처리되는지 확인', async ({ page }) => {
    // 실패를 시뮬레이션하기 위해 모의 응답 재정의
    await page.route('**/mains/insider/rankings', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: '서버 오류' }),
      });
    });

    // 페이지 새로고침
    await page.reload();
    await page.waitForLoadState('networkidle');

    // 오류 상태가 제대로 처리되는지 확인
    // 이는 오류 처리 구현에 따라 달라짐
    // 예를 들어, 오류 메시지를 표시하는 경우:
    // await expect(page.getByText('데이터를 불러오지 못했습니다')).toBeVisible();

    // 또는 섹션을 숨기는 경우:
    // await expect(page.locator('.ranking-section')).toBeHidden();

    // 또는 최소한 페이지가 충돌하지 않는지 확인:
    await expect(page.locator('h2.text-lg.font-bold:has-text("이번주 토론 주제")')).toBeVisible();
  });
});
