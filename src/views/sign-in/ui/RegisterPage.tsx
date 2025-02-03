'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

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

import { checkOtp, sendOtp } from '../api/auth';
import { checkDuplicateId, checkDuplicateNickname } from '../api/registers';
import { useSignup } from '../hooks/useSignup';
import { FormSchema, SignupFormType } from '../model';

export function RegisterPage() {
  const form = useForm<SignupFormType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      nickName: '',
      userId: '',
      password: '',
      confirmPassword: '',
      email: '',
      tempCode: '',
      birthDate: '',
    },
  });

  const { tempCode } = useSignup();
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [isUserIdChecked, setIsUserIdChecked] = useState(false);
  const [hasSentEmailOtp, setHasSentEmailOtp] = useState(false);
  const [isEmailChecked, setIsEmailChecked] = useState(false);

  function onSubmit(data: SignupFormType) {
    console.log(JSON.stringify(data, null, 2));
  }

  const handleCheckDuplicateNickname = async (nickname: string) => {
    const response = await checkDuplicateNickname(tempCode!, nickname);
    if (response.status === 'SUCCESS') {
      form.clearErrors('nickName');
      form.setValue('nickName', nickname);
      setIsNicknameChecked(true);
    } else {
      form.setError('nickName', {
        type: 'manual',
        message: response.message,
      });
      setIsNicknameChecked(false);
    }
  };

  const handleCheckDuplicateUserId = async (userId: string) => {
    const response = await checkDuplicateId(tempCode!, userId);
    if (response.status === 'SUCCESS') {
      form.clearErrors('userId');
      form.setValue('userId', userId);
      setIsUserIdChecked(true);
    } else {
      form.setError('userId', {
        type: 'manual',
        message: response.message,
      });
      setIsUserIdChecked(false);
    }
  };

  const handleSendEmailOtp = async (email: string) => {
    const payload = {
      otpPurpose: 'SIGN_UP',
      tempCode,
      userEmail: email,
    };
    const response = await sendOtp(payload);
    if (response.status === 'SUCCESS') {
      setHasSentEmailOtp(true);
    }
  };

  const handleConfirmEmail = async (inputOtp: string) => {
    const payload = {
      otpPurpose: 'SIGN_UP',
      tempCode,
      email: form.getValues('email'),
      inputOtp,
    };
    const response = await checkOtp(payload);
    if (response.status === 'SUCCESS') {
      setIsEmailChecked(true);
    } else {
      form.setError('email', {
        type: 'manual',
        message: response.message,
      });
    }
  };

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
                    <Input placeholder="닉네임 입력" readOnly={isNicknameChecked} {...field} />
                  </FormControl>
                  <Button
                    disabled={isNicknameChecked}
                    onClick={() => {
                      handleCheckDuplicateNickname(field.value);
                    }}
                  >
                    {isNicknameChecked ? '사용가능' : '중복확인'}
                  </Button>
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
                    <Input placeholder="아이디 입력" readOnly={isUserIdChecked} {...field} />
                  </FormControl>
                  <Button disabled={isUserIdChecked} onClick={() => handleCheckDuplicateUserId(field.value)}>
                    {isUserIdChecked ? '사용가능' : '중복확인'}
                  </Button>
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
                  <Input placeholder="비밀번호 입력" type="password" {...field} />
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
                  <Input placeholder="비밀번호 재입력" type="password" {...field} />
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
                    <Button onClick={() => handleSendEmailOtp(field.value)}>인증메일 발송</Button>
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
                    <Button onClick={() => handleConfirmEmail(field.value)}>인증메일 확인</Button>
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
