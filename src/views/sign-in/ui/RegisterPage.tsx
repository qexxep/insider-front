'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ZodError } from 'zod';

import { useToast } from '@/shared/hooks';
import { cn } from '@/shared/lib';
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

const TIME_LEFT = 180;

export function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { data: signUpInitData } = useSignUpInit();
  const { mutate: checkDuplicateNickname, isPending: isCheckingDuplicateNickname } = useCheckDuplicateNickname();
  const { mutate: checkDuplicateId, isPending: isCheckingDuplicateId } = useCheckDuplicateId();
  const { mutate: sendOtp, isPending: isSendingOtp } = useSendOtp();
  const { mutate: checkOtp, isPending: isCheckingOtp } = useCheckOtp();
  const { mutate: signup, isPending: isSigningUp } = useSignUp();

  const [otpCode, setOtpCode] = useState('');
  const [otpCodeError, setOtpCodeError] = useState('');

  const tempCode = signUpInitData?.data.tempCode ?? '';

  const form = useForm<SignupFormType>({
    resolver: zodResolver(SignupFormSchema),
    defaultValues: {
      nickName: '',
      userId: '',
      password: '',
      confirmPassword: '',
      email: '',
      birthDate: '',
    },
  });

  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [isUserIdChecked, setIsUserIdChecked] = useState(false);
  const [hasSentEmailOtp, setHasSentEmailOtp] = useState(false);
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [isAllTermsAgreed, setIsAllTermsAgreed] = useState(false);

  const [timeLeft, setTimeLeft] = useState(TIME_LEFT);

  useEffect(() => {
    if (timeLeft === 0) {
      setHasSentEmailOtp(false);
      setOtpCode('');
      return;
    }

    if (isEmailChecked || timeLeft === 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isEmailChecked]);

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
    setHasSentEmailOtp(false);
    setOtpCode('');
    setOtpCodeError('');
    const payload = {
      otpPurpose: 'SIGN_UP',
      tempCode,
      userEmail: email,
    };
    await sendOtp(payload, {
      onSuccess: response => {
        console.log(response);
        if (response.status === 'SUCCESS') {
          setTimeLeft(TIME_LEFT);
          setHasSentEmailOtp(true);
        } else {
          setHasSentEmailOtp(false);
          form.setError('email', {
            type: 'manual',
            message: response.message,
          });
          return;
        }
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
      onSuccess: response => {
        if (response.status === 'SUCCESS') {
          setIsEmailChecked(true);
        } else {
          setIsEmailChecked(false);
          setOtpCodeError(response.message);
        }
      },
      onError: error => {
        setIsEmailChecked(false);
        setOtpCodeError(error.message);
      },
    });
  };

  const handleAgreementComplete = (isAllAgreed: boolean) => {
    setIsAllTermsAgreed(isAllAgreed);
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

    if (!isAllTermsAgreed) {
      toast({
        title: '모든 약관에 동의해주세요.',
        variant: 'destructive',
      });
      return;
    }

    const birthDate = `${data.birthDate.slice(0, 4)}-${data.birthDate.slice(4, 6)}-${data.birthDate.slice(6, 8)}`;

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

  const submitButtonDisabled =
    !isNicknameChecked ||
    !isUserIdChecked ||
    !isEmailChecked ||
    !isAllTermsAgreed ||
    !!form.formState.errors.password ||
    !!form.formState.errors.confirmPassword ||
    !!form.formState.errors.birthDate ||
    !!form.formState.errors.gender;

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
              <FormItem className="h-[120px]">
                <FormLabel className="text-lg font-medium">
                  닉네임 <span className="text-destructive">*</span>
                </FormLabel>
                <div className="mt-3 flex space-x-2">
                  <FormControl>
                    <Input
                      placeholder="닉네임 입력"
                      readOnly={isCheckingDuplicateNickname}
                      status={isNicknameChecked ? 'success' : form.formState.errors.nickName ? 'error' : 'default'}
                      {...field}
                      onChange={e => {
                        field.onChange(e);
                        setIsNicknameChecked(false);
                      }}
                    />
                  </FormControl>
                  <Button
                    disabled={field.value.length === 0}
                    onClick={async e => {
                      e.preventDefault();
                      const isValid = await form.trigger(field.name);
                      if (!isValid) return;
                      handleCheckDuplicateNickname(field.value);
                    }}
                    isLoading={isCheckingDuplicateNickname}
                    className="w-[150px] text-lg"
                  >
                    중복확인
                  </Button>
                </div>
                <FormMessage className={cn(isNicknameChecked && 'text-input-success')}>
                  {isNicknameChecked && '사용가능한 닉네임입니다.'}
                </FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="userId"
            render={({ field }) => (
              <FormItem className="h-[120px]">
                <FormLabel className="text-lg font-medium">
                  아이디 <span className="text-destructive">*</span>
                </FormLabel>
                <div className="mt-3 flex space-x-2">
                  <FormControl>
                    <Input
                      placeholder="아이디 입력"
                      readOnly={isCheckingDuplicateId}
                      status={isUserIdChecked ? 'success' : form.formState.errors.userId ? 'error' : 'default'}
                      {...field}
                      onChange={e => {
                        field.onChange(e);
                        setIsUserIdChecked(false);
                      }}
                    />
                  </FormControl>
                  <Button
                    disabled={field.value.length === 0}
                    onClick={async e => {
                      e.preventDefault();
                      const isValid = await form.trigger(field.name);
                      if (!isValid) return;
                      handleCheckDuplicateUserId(field.value);
                    }}
                    isLoading={isCheckingDuplicateId}
                    className="w-[150px] text-lg"
                  >
                    중복확인
                  </Button>
                </div>
                <FormMessage className={cn(isUserIdChecked && 'text-input-success')}>
                  {isUserIdChecked ? '사용가능한 아이디입니다.' : form.formState.errors.userId?.message}
                </FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="h-[120px]">
                <FormLabel className="text-lg font-medium">
                  비밀번호<span className="text-destructive">*</span>
                </FormLabel>
                <FormControl className="mt-3 flex space-x-2">
                  <PasswordInput
                    placeholder="비밀번호를 입력해주세요"
                    {...field}
                    onChange={e => {
                      field.onChange(e);
                      form.trigger('confirmPassword');
                    }}
                    status={form.formState.errors.password ? 'error' : 'default'}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="h-[120px]">
                <FormLabel className="text-lg font-medium">
                  비밀번호 확인<span className="text-destructive">*</span>
                </FormLabel>
                <FormControl className="mt-3 flex space-x-2">
                  <PasswordInput
                    placeholder="비밀번호 재입력"
                    {...field}
                    status={form.formState.errors.confirmPassword ? 'error' : 'default'}
                  />
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
                <FormItem className="h-[120px]">
                  <FormLabel className="text-lg font-medium">
                    이메일<span className="text-destructive">*</span>
                  </FormLabel>
                  <div className="mt-3 flex space-x-2">
                    <FormControl>
                      <Input
                        placeholder="이메일 입력"
                        status={form.formState.errors.email ? 'error' : 'default'}
                        {...field}
                        onChange={e => {
                          field.onChange(e);
                          setIsEmailChecked(false);
                        }}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      onClick={async () => {
                        const isValid = await form.trigger(field.name);
                        if (!isValid) return;
                        handleSendEmailOtp(field.value);
                      }}
                      className="min-w-[150px] px-6 text-lg"
                      isLoading={isSendingOtp}
                    >
                      인증메일 발송
                    </Button>
                  </div>
                  <FormMessage className={cn(isEmailChecked && 'text-input-success')}>
                    {isEmailChecked && '사용 가능한 이메일입니다.'}
                  </FormMessage>
                </FormItem>
              )}
            />
            {hasSentEmailOtp && !isEmailChecked && (
              <div className="mt-3 flex space-x-2">
                <div className="flex w-full flex-col">
                  <FormControl>
                    <div className="relative flex w-full">
                      <Input
                        placeholder="인증번호 입력"
                        value={otpCode}
                        onChange={e => {
                          const value = e.target.value.replace(/[^0-9]/g, '');
                          console.log(value);
                          if (value === '') {
                            setOtpCode(value);
                            return;
                          }
                          if (value.length > 6) {
                            return;
                          }
                          try {
                            tempCodeSchema.parse(value);
                            if (value.length <= 6) {
                              setOtpCode(value);
                            }
                          } catch (error) {
                            if (error instanceof ZodError) {
                              setOtpCodeError(error.message);
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
                  <FormMessage>{otpCodeError}</FormMessage>
                </div>
                <Button
                  className="min-w-[150px] text-lg"
                  type="button"
                  disabled={otpCode.length !== 6 || timeLeft === 0}
                  onClick={async () => {
                    handleConfirmEmail(otpCode);
                  }}
                  isLoading={isCheckingOtp}
                >
                  인증메일 확인
                </Button>
              </div>
            )}
          </div>
          <FormField
            control={form.control}
            name="birthDate"
            render={({ field }) => (
              <FormItem className="h-[120px]">
                <FormLabel className="text-lg font-medium">
                  생년월일<span className="text-destructive">*</span>
                </FormLabel>
                <FormControl className="mt-3 flex space-x-2">
                  <Input
                    type="year"
                    placeholder="ex) 19990101"
                    {...field}
                    onChange={e => {
                      const value = e.target.value;
                      if (value.length > 8) {
                        return;
                      }
                      field.onChange(value);
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem className="h-[100px] space-y-3">
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
            <TermsAgreement onAgreementComplete={handleAgreementComplete} />
          </div>
          <Button
            type="submit"
            size="lg"
            className="m-auto h-[70px] w-[350px] rounded-[35px] text-lg font-bold"
            isLoading={isSigningUp}
            disabled={submitButtonDisabled}
          >
            회원가입하기
          </Button>
        </form>
      </div>
    </Form>
  );
}
