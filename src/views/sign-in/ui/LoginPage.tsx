import Link from 'next/link';

import { Button, Checkbox, Input } from '@/shared/ui';

export function LoginPage() {
  return (
    <div className="py-15 mx-auto flex max-w-[400px] flex-col items-center gap-16">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-[32px] font-bold text-[#242424]">로그인</h1>
      </div>
      <div className="flex w-full flex-col gap-5">
        <Input type="nickName" placeholder="아이디를 입력해주세요." />
        <Input type="nickName" placeholder="비밀번호를 입력해주세요." />
        <div className="flex items-center space-x-2">
          <Checkbox id="rememberId" />
          <label
            htmlFor="rememberId"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            아이디 저장
          </label>
        </div>
        <Button>로그인</Button>
      </div>
      <div>
        <ul className="flex space-x-3">
          <li>아이디 찾기</li>
          <li>비밀번호 찾기</li>
          <li>
            <Link href={'/signup'}>회원가입</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
