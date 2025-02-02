import { Button, Input, Label, RadioGroup, RadioGroupItem } from '@/shared/ui';

export function RegisterPage() {
  return (
    <div className="py-15 mx-auto flex max-w-[950px] flex-col items-center gap-16">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-[32px] font-bold text-[#242424]">회원가입</h1>
        <p className="text-[18px] font-medium text-[#616161]">회원가입을 통해 더 많은 토론에 참여해보세요</p>
      </div>
      <div className="flex w-fit flex-col gap-9">
        <div className="grid w-full max-w-sm items-center gap-3">
          <Label htmlFor="nickName">닉네임</Label>
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input type="nickName" placeholder="닉네임 입력" />
            <Button type="submit">중복확인</Button>
          </div>
        </div>
        <div className="grid w-full max-w-sm items-center gap-3">
          <Label htmlFor="userId">아이디</Label>
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input type="userId" placeholder="아이디 입력" />
            <Button type="submit">중복확인</Button>
          </div>
        </div>
        <div className="grid w-full max-w-sm items-center gap-3">
          <Label htmlFor="password">비밀번호</Label>
          <div className="flex w-full max-w-sm items-center">
            <Input type="password" placeholder="비밀번호 입력" />
          </div>
        </div>
        <div className="grid w-full max-w-sm items-center gap-3">
          <Label htmlFor="confirmPassword">비밀번호 확인</Label>
          <div className="flex w-full max-w-sm items-center">
            <Input type="confirmPassword" placeholder="비밀번호 재입력" />
          </div>
        </div>
        <div className="grid w-full max-w-sm items-center gap-3">
          <Label htmlFor="email">이메일</Label>
          <div className="flex w-full max-w-sm flex-col items-center gap-3">
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input type="email" placeholder="이메일 입력" />
              <Button type="submit">인증메일 발송</Button>
            </div>
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input type="tempCode" placeholder="인증번호 입력" />
              <Button type="submit">인증번호 확인</Button>
            </div>
          </div>
        </div>
        <div className="grid w-full max-w-sm items-center gap-3">
          <Label htmlFor="confirmPassword">생년월일</Label>
          <div className="flex w-full max-w-sm items-center gap-3">
            <div className="flex items-center gap-1">
              <Input type="confirmPassword" placeholder="태어난 년도" className="w-28" />
              <Label>년</Label>
            </div>
            <div className="flex items-center gap-1">
              <Input type="confirmPassword" placeholder="태어난 월" className="w-20" />
              <Label>월</Label>
            </div>
            <div className="flex items-center gap-1">
              <Input type="confirmPassword" placeholder="태어난 일" className="w-20" />
              <Label>일</Label>
            </div>
          </div>
        </div>
        <div className="grid w-full max-w-sm items-center gap-3">
          <Label htmlFor="gender">성별</Label>
          <RadioGroup defaultValue="M" className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="M" id="M" />
              <Label htmlFor="M">남자</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="W" id="W" />
              <Label htmlFor="W">여자</Label>
            </div>
          </RadioGroup>
        </div>
        <div className="h-[1px] w-full bg-[#E1E1E1]"></div>
      </div>
      {/* <div>약관</div> */}
      <div>
        <Button>회원가입하기</Button>
      </div>
    </div>
  );
}
