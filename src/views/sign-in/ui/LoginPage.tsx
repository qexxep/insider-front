'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCookies } from 'next-client-cookies';
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

import { useSignIn } from '../api/queries';
import { LoginFormSchema, LoginFormType } from '../model';

export function LoginPage({ initialRememberId }: { initialRememberId: string | null }) {
  const cookies = useCookies();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl');
  // Check if the user has explicitly disabled remember ID
  const rememberDisabled = cookies.get('remember_id_disabled') === 'true';

  const { mutate: signIn, isPending } = useSignIn();
  // Default to true unless the user has explicitly disabled it
  const [rememberId, setRememberId] = useState<boolean>(!rememberDisabled);
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
        cookies.set('access_token', accessToken);
        cookies.set('refresh_token', refreshToken);

        if (rememberId) {
          cookies.set('remember_id', data.userId);
          cookies.remove('remember_id_disabled');
        } else {
          cookies.remove('remember_id');
          // Mark that the user has explicitly disabled remember ID
          cookies.set('remember_id_disabled', 'true');
        }

        window.location.href = returnUrl ?? '/';
      },
      onError: error => {
        handleErrorInfo(error.message);
      },
    });
  };

  const handleRememberId = (checked: boolean) => {
    setRememberId(checked);
    // Update the preference immediately when the checkbox changes
    if (!checked) {
      cookies.set('remember_id_disabled', 'true');
      // 체크박스 해제 시 즉시 저장된 아이디 삭제
      cookies.remove('remember_id');
    } else {
      cookies.remove('remember_id_disabled');
      // 체크박스 체크 시 현재 입력된 아이디 저장 (있는 경우에만)
      const currentUserId = form.getValues('userId');
      if (currentUserId) {
        cookies.set('remember_id', currentUserId);
      }
    }
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
          <div className="mb-6 min-h-[60px]">
            {errorInfo && (
              <Alert variant="error" className="break-all">
                {errorInfo}
              </Alert>
            )}
          </div>
          <Button size="lg" className={'mb-[28px] h-[70px] rounded-[36px] text-[18px] font-bold'} isLoading={isPending}>
            로그인
          </Button>
        </form>
        <div>
          <ul className="flex space-x-[48px]">
            <Link href={'/find?type=id'}>
              <li className="text-[18px] text-gray-600 underline underline-offset-[3px]">아이디 찾기</li>
            </Link>
            <Link href={'/find?type=password'}>
              <li className="text-[18px] text-gray-600 underline underline-offset-[3px]">비밀번호 찾기</li>
            </Link>
            <Link href={'/signup'}>
              <li className="text-[18px] text-gray-600 underline underline-offset-[3px]">회원가입</li>
            </Link>
          </ul>
        </div>
      </Form>
      <div className="mb-[40px] mt-[60px] flex w-full items-center">
        <div className="h-[1px] flex-1 bg-[#9E9E9E]"></div>
        <span className="mx-4 text-lg text-gray-900">또는 다음으로 로그인</span>
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
