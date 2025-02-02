'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  RadioGroup,
  RadioGroupItem,
} from '@/shared/ui';

const FormSchema = z
  .object({
    nickName: z.string().min(2, {
      message: 'Username must be at least 2 characters.',
    }),
    userId: z
      .string()
      .min(3, { message: 'User ID must be at least 3 characters.' })
      .max(20, { message: 'User ID must be at most 20 characters.' }),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters.' })
      .max(30, { message: 'Password must be at most 30 characters.' })
      .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter.' }) // 대문자 요구 사항 추가
      .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter.' }) // 소문자 요구 사항 추가
      .regex(/[0-9]/, { message: 'Password must contain at least one number.' }), // 숫자 요구 사항 추가
    confirmPassword: z.string(),
    email: z.string().email({ message: 'Please enter a valid email address.' }), // 이메일 유효성 검사
    tempCode: z.string(),
    birthDate: z.string(),
    gender: z.enum(['M', 'F', 'other'], {
      required_error: 'You need to select a notification type.',
    }),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export function RegisterPage() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {},
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(JSON.stringify(data, null, 2));
    // toast({
    //   title: 'You submitted the following values:',
    //   description: (
    //     <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
    //       <code className='text-white'>{JSON.stringify(data, null, 2)}</code>
    //     </pre>
    //   ),
    // });
  }

  return (
    <Form {...form}>
      <div className="flex flex-col gap-20 py-20">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-[32px] font-bold text-[#242424]">회원가입</h1>
          <p className="text-[18px] font-medium text-[#616161]">회원가입을 통해 더 많은 토론에 참여해보세요</p>
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto flex w-[750px] flex-col gap-9">
          <FormField
            control={form.control}
            name="nickName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>닉네임</FormLabel>
                <div className="mt-3 flex space-x-2">
                  <FormControl>
                    <Input placeholder="닉네임 입력" {...field} />
                  </FormControl>
                  <Button>중복확인</Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="userId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>아이디</FormLabel>
                <div className="flex space-x-2">
                  <FormControl>
                    <Input placeholder="아이디 입력" {...field} />
                  </FormControl>
                  <Button>중복확인</Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>비밀번호</FormLabel>
                <FormControl>
                  <Input placeholder="비밀번호 입력" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>비밀번호 확인</FormLabel>
                <FormControl>
                  <Input placeholder="비밀번호 재입력" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col gap-3">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>이메일</FormLabel>
                  <div className="flex space-x-2">
                    <FormControl>
                      <Input placeholder="이메일 입력" {...field} />
                    </FormControl>
                    <Button>인증메일 발송</Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tempCode"
              render={({ field }) => (
                <FormItem>
                  <div className="flex space-x-2">
                    <FormControl>
                      <Input placeholder="인증번호 입력" {...field} />
                    </FormControl>
                    <Button>인증메일 확인</Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="birthDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>생년월일</FormLabel>
                <div className="flex space-x-2">
                  <FormControl>
                    <Input placeholder="생년월일 입력" {...field} />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>성별</FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-1">
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="M" />
                      </FormControl>
                      <FormLabel className="font-normal">남자</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="F" />
                      </FormControl>
                      <FormLabel className="font-normal">여자</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </div>
    </Form>
  );
}
