export default function Footer() {
  return (
    <footer className="min-h-[120px] pt-5">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex justify-center space-x-4 text-sm text-gray-600">
          <span>회사소개</span>
          <span className="text-gray-300">|</span>
          <span>제휴안내</span>
          <span className="text-gray-300">|</span>
          <span>광고안내</span>
          <span className="text-gray-300">|</span>
          <span>이용약관</span>
          <span className="text-gray-300">|</span>
          <span>개인정보처리방침</span>
        </div>
        <div className="mt-5 text-center text-sm text-black">Copyright © 2024 INSIDER. All rights reserved.</div>
      </div>
    </footer>
  );
}
