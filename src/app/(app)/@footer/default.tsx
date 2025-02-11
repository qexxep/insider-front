import { Separator } from '@/shared/ui';

export default function Footer() {
  return (
    <footer className="min-h-[120px] pt-5">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
          {/* Link로 교체될 예정 */}
          <span>회사소개</span>
          <Separator orientation="vertical" className="h-4" />
          <span>제휴안내</span>
          <Separator orientation="vertical" className="h-4" />
          <span>광고안내</span>
          <Separator orientation="vertical" className="h-4" />
          <span>이용약관</span>
          <Separator orientation="vertical" className="h-4" />
          <span>개인정보처리방침</span>
        </div>
        <small className="mt-5 block text-center text-sm text-black">
          Copyright © 2024 INSIDER. All rights reserved.
        </small>
      </div>
    </footer>
  );
}
