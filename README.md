# Insider-Front

![Insider-Front](https://via.placeholder.com/800x400?text=Insider-Front)

## 프로젝트 소개

Insider-Front는 다양한 주제에 대한 토론과 의견 공유를 위한 커뮤니티 플랫폼입니다. 사용자들은 다양한 카테고리의 게시물을 작성하고, 댓글을 달고, 투표에 참여할 수 있습니다. 실시간 랭킹 시스템을 통해 인기 있는 토론 주제를 확인할 수 있으며, 개인화된 경험을 제공합니다.

## 폴더구조 (FSD 패턴)

프로젝트는 Feature-Sliced Design (FSD) 패턴을 기반으로 구성되어 있습니다:

```
src/
├── app/                # Next.js App Router 구조
│   └── (app)/          # 메인 앱 레이아웃 및 라우팅
├── entity/             # 비즈니스 엔티티 (사용자, 인증 등)
├── feature/            # 기능 단위 컴포넌트 (댓글, 성향 분석 등)
├── shared/             # 공유 유틸리티 및 UI 컴포넌트
│   ├── api/            # API 클라이언트 및 쿼리 유틸리티
│   ├── lib/            # 유틸리티 함수
│   ├── ui/             # 재사용 가능한 UI 컴포넌트
│   └── hooks/          # 커스텀 훅
├── views/              # 페이지 뷰 컴포넌트
│   ├── main/           # 메인 페이지
│   ├── posts/          # 게시물 관련 페이지
│   ├── sign-in/        # 로그인 페이지
│   └── mypage/         # 마이페이지
└── widgets/            # 복합 UI 위젯
```

## 기술 스택

### 프론트엔드

- **Next.js 15**: React 프레임워크 (App Router)
- **React 19**: UI 라이브러리
- **TypeScript**: 정적 타입 지원
- **TailwindCSS**: 유틸리티 기반 CSS 프레임워크
- **Radix UI**: 접근성 높은 UI 컴포넌트 라이브러리
- **Tanstack Query**: 서버 상태 관리
- **React Hook Form**: 폼 관리
- **Zod**: 스키마 검증

### 테스트

- **Playwright**: E2E 테스트
- **MSW**: API 모킹

### 개발 도구

- **ESLint**: 코드 품질 관리
- **Prettier**: 코드 포맷팅
- **Husky**: Git 훅 관리

## 주요 기능

### 메인 페이지

- 주간 토론 주제 캐러셀
- 인기 게시물 랭킹
- 카테고리별 최신 게시물

### 게시물

- 카테고리별 게시물 목록
- 게시물 상세 보기
- 게시물 작성 및 수정
- 베스트/워스트 게시물 표시

### 댓글

- 댓글 작성 및 조회
- 댓글 페이지네이션

### 사용자 관리

- 회원가입 및 로그인
- 마이페이지
- 사용자 성향 분석

### 기타

- 반응형 디자인
- 접근성 고려
- 오류 처리 및 로딩 상태 관리

## 시작하기

### 개발 환경 설정

```bash
# 저장소 클론
git clone https://github.com/qexxep/insider-front.git
cd insider-front

# 의존성 설치
yarn install

# 개발 서버 실행
yarn dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 결과를 확인할 수 있습니다.

### 빌드 및 배포

```bash
# 프로덕션 빌드
yarn build

# 빌드 결과 실행
yarn start
```

### 테스트 실행

```bash
# Playwright 테스트 실행
yarn playwright

# UI 모드로 테스트 실행
yarn playwright:ui
```

## 기여 방법

1. 저장소를 포크합니다.
2. 새로운 기능 브랜치를 생성합니다 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add some amazing feature'`)
4. 브랜치에 푸시합니다 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성합니다.

## 라이센스

이 프로젝트는 [MIT 라이센스](LICENSE)를 따릅니다.
