import { Separator } from '@/shared/ui';

export default function Footer() {
  return (
    <footer className="min-h-[120px] w-full bg-transparent pt-5">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
          <span>이용약관</span>
          <Separator orientation="vertical" className="h-4" />
          <span>개인정보처리방침</span>
        </div>
        <small className="mt-5 block text-center text-sm text-black">
          Copyright © 2025 INSSIDER. All rights reserved.
        </small>
      </div>
    </footer>
  );
}
