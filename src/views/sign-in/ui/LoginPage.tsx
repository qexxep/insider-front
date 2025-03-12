'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import {
  Alert,
  Button,
  Checkbox,
  Form,
  FormControl,
  FormField,
  FormItem,
  Icons,
  Input,
  PasswordInput,
} from '@/shared/ui';
import { removeClientCookie, setClientCookie } from '@/shared/utils';

import { useSignIn } from '../api/queries';
import { LoginFormSchema, LoginFormType } from '../model';

export function LoginPage({ initialRememberId }: { initialRememberId: string | null }) {
  const router = useRouter();
  const { mutate: signIn, isPending } = useSignIn();
  const [rememberId, setRememberId] = useState<boolean>(!!initialRememberId);
  const [errorInfo, setErrorInfo] = useState<string | null>(null);

  const form = useForm<LoginFormType>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      userId: initialRememberId ?? '',
      password: '',
    },
  });

  form.watch(() => {
    setErrorInfo(null);
  });

  const onSubmit = async (data: LoginFormType) => {
    setErrorInfo(null);
    await signIn(data, {
      onSuccess: response => {
        const { accessToken, refreshToken } = response.data.jwt;
        setClientCookie('access_token', accessToken);
        setClientCookie('refresh_token', refreshToken);

        if (rememberId) {
          setClientCookie('remember_id', data.userId);
        } else {
          removeClientCookie('remember_id');
        }

        router.push('/');
        router.refresh();
      },
      onError: error => {
        handleErrorInfo(error.message);
      },
    });
  };

  const handleRememberId = (checked: boolean) => {
    setRememberId(checked);
  };

  const handleErrorInfo = (errorInfo: string) => {
    setErrorInfo(errorInfo);
  };

  return (
    <div className="py-15 mx-auto mt-24 flex w-[560px] flex-col items-center">
      <div className="flex flex-col items-center justify-center">
        <h1 className="mb-10 text-[28px] font-bold">로그인</h1>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col">
          <FormField
            control={form.control}
            name="userId"
            render={({ field }) => (
              <FormItem className="mb-[20px]">
                <FormControl>
                  <Input
                    placeholder="아이디를 입력해주세요."
                    {...field}
                    className="h-[56px]"
                    status={form.formState.errors.userId ? 'error' : undefined}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="mb-[17px]">
                <FormControl>
                  <PasswordInput
                    placeholder="비밀번호를 입력해주세요."
                    {...field}
                    className="h-[56px]"
                    status={form.formState.errors.password ? 'error' : undefined}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="mb-3 flex items-center space-x-2">
            <Checkbox id="rememberId" checked={rememberId} onCheckedChange={handleRememberId} />
            <label
              htmlFor="rememberId"
              className="cursor-pointer select-none text-[19px] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              아이디 저장
            </label>
          </div>
          <div className="mb-6 h-[60px]">{errorInfo && <Alert variant="error">{errorInfo}</Alert>}</div>
          <Button className={'mb-[28px] h-[70px] rounded-[36px] text-[18px] font-bold'} isLoading={isPending}>
            로그인
          </Button>
        </form>
        <div>
          <ul className="flex space-x-[48px]">
            <li className="text-[18px] text-[#616161] underline underline-offset-[3px]">아이디 찾기</li>
            <li className="text-[18px] text-[#616161] underline underline-offset-[3px]">비밀번호 찾기</li>
            <li className="text-[18px] text-[#616161] underline underline-offset-[3px]">
              <Link href={'/signup'}>회원가입</Link>
            </li>
          </ul>
        </div>
      </Form>
      <div className="mb-[40px] mt-[60px] flex w-full items-center">
        <div className="h-[1px] flex-1 bg-[#9E9E9E]"></div>
        <span className="mx-4 text-lg text-[#242424]">또는 다음으로 로그인</span>
        <div className="h-[1px] flex-1 bg-[#9E9E9E]"></div>
      </div>
      <div className="mb-12 flex w-full items-center justify-center gap-10">
        <Button variant="ghost" size="icon" className="h-[60px] w-[60px] rounded-full [&_svg]:size-[60px]">
          <Icons.naver />
        </Button>
        <Button variant="ghost" size="icon" className="h-[60px] w-[60px] rounded-full [&_svg]:size-[60px]">
          <Icons.kakao />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-[60px] w-[60px] rounded-full border-[2px] border-gray-200 [&_svg]:size-[32px]"
        >
          <Icons.google />
        </Button>
      </div>
    </div>
  );
}
