'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ZodError } from 'zod';

import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  PasswordInput,
  RadioGroup,
  RadioGroupItem,
} from '@/shared/ui';

import {
  useCheckDuplicateId,
  useCheckDuplicateNickname,
  useCheckOtp,
  useSendOtp,
  useSignUp,
  useSignUpInit,
} from '../api/queries';
import { SignupFormSchema, SignupFormType, tempCodeSchema } from '../model';
import { TermsAgreement } from './TermsAgreement';

export function RegisterPage() {
  const router = useRouter();
  const { data: signUpInitData } = useSignUpInit();
  const { mutate: checkDuplicateNickname } = useCheckDuplicateNickname();
  const { mutate: checkDuplicateId } = useCheckDuplicateId();
  const { mutate: sendOtp } = useSendOtp();
  const { mutate: checkOtp } = useCheckOtp();
  const { mutate: signup } = useSignUp();

  const tempCode = signUpInitData?.data.tempCode ?? '';

  const form = useForm<SignupFormType>({
    resolver: zodResolver(SignupFormSchema),
    defaultValues: {
      nickName: '',
      userId: '',
      password: '',
      confirmPassword: '',
      email: '',
      tempCode: '',
      'birthDate-year': '',
      'birthDate-month': '',
      'birthDate-day': '',
    },
  });

  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [isUserIdChecked, setIsUserIdChecked] = useState(false);
  const [hasSentEmailOtp, setHasSentEmailOtp] = useState(false);
  const [isEmailChecked, setIsEmailChecked] = useState(false);

  const [timeLeft, setTimeLeft] = useState(180);

  useEffect(() => {
    if (timeLeft === 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  const handleCheckDuplicateNickname = async (nickname: string) => {
    await checkDuplicateNickname(
      { tempCode, userNickname: nickname },
      {
        onSuccess: () => {
          form.clearErrors('nickName');
          form.setValue('nickName', nickname);
          setIsNicknameChecked(true);
        },
        onError: error => {
          form.setError('nickName', {
            type: 'manual',
            message: error.message,
          });
          setIsNicknameChecked(false);
        },
      }
    );
  };

  const handleCheckDuplicateUserId = async (userId: string) => {
    await checkDuplicateId(
      { tempCode, userId },
      {
        onSuccess: () => {
          form.clearErrors('userId');
          form.setValue('userId', userId);
          setIsUserIdChecked(true);
        },
        onError: error => {
          form.setError('userId', {
            type: 'manual',
            message: error.message,
          });
          setIsUserIdChecked(false);
        },
      }
    );
  };

  const handleSendEmailOtp = async (email: string) => {
    const payload = {
      otpPurpose: 'SIGN_UP',
      tempCode,
      userEmail: email,
    };
    await sendOtp(payload, {
      onSuccess: () => {
        setHasSentEmailOtp(true);
      },
      onError: error => {
        setHasSentEmailOtp(false);
        form.setError('email', {
          type: 'manual',
          message: error.message,
        });
      },
    });
  };

  const handleConfirmEmail = async (inputOtp: string) => {
    const payload = {
      otpPurpose: 'SIGN_UP',
      tempCode,
      email: form.getValues('email'),
      inputOtp,
    };
    await checkOtp(payload, {
      onSuccess: () => {
        setIsEmailChecked(true);
      },
      onError: error => {
        setIsEmailChecked(false);
        form.setError('email', {
          type: 'manual',
          message: error.message,
        });
      },
    });
  };

  const onSubmit = async (data: SignupFormType) => {
    if (!isNicknameChecked) {
      form.setError('nickName', {
        type: 'manual',
        message: '닉네임 중복 확인이 필요합니다.',
      });
      return;
    }

    if (!isUserIdChecked) {
      form.setError('userId', {
        type: 'manual',
        message: '아이디 중복 확인이 필요합니다.',
      });
      return;
    }

    if (!isEmailChecked) {
      form.setError('email', {
        type: 'manual',
        message: '이메일 인증을 완료해주세요.',
      });
      return;
    }

    const birthDate = data['birthDate-year'] + '-' + data['birthDate-month'] + '-' + data['birthDate-day'];
    const payload = {
      nickName: data.nickName,
      userId: data.userId,
      password: data.password,
      email: data.email,
      tempCode,
      birthDate,
      gender: data.gender,
      confirmPassword: data.confirmPassword,
    };

    console.log(payload);

    await signup(payload, {
      onSuccess: () => {
        alert('회원가입이 완료되었습니다.');
        router.push('/signup/complete');
      },
      onError: error => {
        console.error(error.message);
      },
    });
  };

  return (
    <Form {...form}>
      <div className="flex flex-col gap-[40px] py-[40px]">
        <div className="flex flex-col items-center justify-center">
          <h1 className="mb-[12px] text-3xl font-bold">회원가입</h1>
          <p className="text-lg font-medium text-muted-foreground">회원가입을 통해 더 많은 토론에 참여해보세요</p>
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto flex w-[750px] flex-col gap-9">
          <FormField
            control={form.control}
            name="nickName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-medium">
                  닉네임 <span className="text-destructive">*</span>
                </FormLabel>
                <div className="mt-3 flex space-x-2">
                  <FormControl>
                    <Input placeholder="닉네임 입력" readOnly={isNicknameChecked} {...field} />
                  </FormControl>
                  <Button
                    disabled={isNicknameChecked || field.value.length === 0}
                    onClick={async e => {
                      e.preventDefault();
                      const isValid = await form.trigger(field.name);
                      if (!isValid) return;
                      handleCheckDuplicateNickname(field.value);
                    }}
                  >
                    중복확인
                  </Button>
                </div>
                <FormMessage>{isNicknameChecked && '사용가능한 닉네임입니다.'}</FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="userId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-medium">
                  아이디 <span className="text-destructive">*</span>
                </FormLabel>
                <div className="mt-3 flex space-x-2">
                  <FormControl>
                    <Input placeholder="아이디 입력" readOnly={isUserIdChecked} {...field} />
                  </FormControl>
                  <Button
                    disabled={isUserIdChecked || field.value.length === 0}
                    onClick={async e => {
                      e.preventDefault();
                      const isValid = await form.trigger(field.name);
                      if (!isValid) return;
                      handleCheckDuplicateUserId(field.value);
                    }}
                  >
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
                <FormLabel className="text-lg font-medium">
                  비밀번호<span className="text-destructive">*</span>
                </FormLabel>

                <FormControl className="mt-3 flex space-x-2">
                  <PasswordInput placeholder="비밀번호를 입력해주세요" {...field} />
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
                <FormLabel className="text-lg font-medium">
                  비밀번호 확인<span className="text-destructive">*</span>
                </FormLabel>

                <FormControl className="mt-3 flex space-x-2">
                  <PasswordInput placeholder="비밀번호 재입력" {...field} />
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
                  <FormLabel className="text-lg font-medium">
                    이메일<span className="text-destructive">*</span>
                  </FormLabel>
                  <div className="mt-3 flex space-x-2">
                    <FormControl>
                      <Input placeholder="이메일 입력" readOnly={isEmailChecked} {...field} />
                    </FormControl>
                    <Button
                      type="button"
                      className="w-[130px]"
                      disabled={isEmailChecked || (!isEmailChecked && hasSentEmailOtp) || field.value.length === 0}
                      onClick={async () => {
                        const isValid = await form.trigger(field.name);
                        if (!isValid) return;
                        handleSendEmailOtp(field.value);
                      }}
                    >
                      {isEmailChecked ? '인증완료' : '인증메일 발송'}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            {hasSentEmailOtp && !isEmailChecked && (
              <FormField
                control={form.control}
                name="tempCode"
                render={({ field }) => (
                  <FormItem>
                    <div className="mt-3 flex space-x-2">
                      <FormControl>
                        <div className="relative flex w-full">
                          <Input
                            placeholder="인증번호 입력"
                            {...field}
                            onChange={e => {
                              const value = e.target.value.replace(/[^0-9]/g, '');
                              if (value === '') {
                                field.onChange(value);
                                return;
                              }
                              try {
                                tempCodeSchema.parse(value);
                                if (value.length <= 6) {
                                  field.onChange(value);
                                }
                              } catch (error) {
                                if (error instanceof ZodError) {
                                  form.setError(field.name, {
                                    type: 'manual',
                                  });
                                } else {
                                  console.error('알 수 없는 오류:', error);
                                }
                              }
                            }}
                          />
                          <div className="absolute right-4 flex h-full items-center">
                            <span>{formatTime(timeLeft)}</span>
                          </div>
                        </div>
                      </FormControl>
                      <Button
                        className="w-[130px]"
                        type="button"
                        disabled={field.value.length !== 6 || timeLeft === 0}
                        onClick={async () => {
                          const isValid = await form.trigger(field.name);
                          if (!isValid) return;
                          handleConfirmEmail(field.value);
                        }}
                      >
                        인증메일 확인
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
          <div className="flex flex-col gap-3">
            <FormLabel className="text-lg font-medium">
              생년월일 <span className="text-destructive">*</span>
            </FormLabel>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1">
                <FormField
                  control={form.control}
                  name="birthDate-year"
                  render={({ field }) => (
                    <FormItem className="w-[80px]">
                      <div className="flex space-x-2">
                        <FormControl className="flex space-x-2">
                          <Input type="year" placeholder="1900" {...field} />
                        </FormControl>
                      </div>
                    </FormItem>
                  )}
                />
                <span>년</span>
              </div>
              <div className="flex items-center gap-1">
                <FormField
                  control={form.control}
                  name="birthDate-month"
                  render={({ field }) => (
                    <FormItem className="w-[60px]">
                      <div className="flex space-x-2">
                        <FormControl className="flex space-x-2">
                          <Input type="year" placeholder="01" {...field} />
                        </FormControl>
                      </div>
                    </FormItem>
                  )}
                />
                <span>월</span>
              </div>
              <div className="flex items-center gap-1">
                <FormField
                  control={form.control}
                  name="birthDate-day"
                  render={({ field }) => (
                    <FormItem className="w-[60px]">
                      <div className="flex space-x-2">
                        <FormControl className="flex space-x-2">
                          <Input type="year" placeholder="01" {...field} />
                        </FormControl>
                      </div>
                    </FormItem>
                  )}
                />
                <span>일</span>
              </div>
            </div>
          </div>
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-lg font-medium">
                  성별 <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl className="mt-3">
                  <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-1">
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormLabel htmlFor="male" className="flex cursor-pointer items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem id="male" value="M" />
                        </FormControl>
                        <span className="font-normal">남자</span>
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormLabel htmlFor="female" className="flex cursor-pointer items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem id="female" value="F" />
                        </FormControl>
                        <span className="font-normal">여자</span>
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col border-t border-[#E1E1E1] py-10">
            <TermsAgreement />
          </div>
          <Button type="submit" className="m-auto h-[70px] w-[350px] rounded-[35px] text-lg font-bold">
            회원가입하기
          </Button>
        </form>
      </div>
    </Form>
  );
}
