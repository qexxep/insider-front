'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { useToast } from '@/shared/hooks';
import { Button, Checkbox, Form, FormControl, FormField, FormItem, FormMessage, Input, ToastAction } from '@/shared/ui';
import { setClientCookie } from '@/shared/utils';

import { login } from '../api/auth';
import { LoginFormSchema, LoginFormType } from '../model';

export function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<LoginFormType>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      userId: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormType) => {
    const response = await login(data);
    if (response.status === 'SUCCESS') {
      const { accessToken, refreshToken } = response.data.jwt;
      setClientCookie('access_token', accessToken);
      setClientCookie('refresh_token', refreshToken);
      //
      router.push('/');
      router.refresh();
    } else {
      toast({
        variant: 'destructive',
        title: '로그인에 실패했습니다.',
        description: response.message,
      });
    }
  };

  return (
    <div className="py-15 mx-auto mt-24 flex max-w-[400px] flex-col items-center gap-16">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold">로그인</h1>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col gap-5">
          <FormField
            control={form.control}
            name="userId"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="아이디를 입력해주세요." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="password" placeholder="비밀번호를 입력해주세요." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
        </form>
        <div>
          <ul className="flex space-x-3">
            <li>아이디 찾기</li>
            <li>비밀번호 찾기</li>
            <li>
              <Link href={'/signup'}>회원가입</Link>
            </li>
          </ul>
        </div>
      </Form>
    </div>
  );
}
