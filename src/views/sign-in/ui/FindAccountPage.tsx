'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import {
  Alert,
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  Icons,
  Input,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/ui';

import { useCheckOtp, useFindId, useFindPassword, useSendOtp } from '../api/queries';
import {
  FindIdFormSchema,
  FindIdFormType,
  FindPasswordFormSchema,
  FindPasswordFormType,
  VerifyOtpFormSchema,
  VerifyOtpFormType,
} from '../model';

type TabType = 'id' | 'password';
type StepType = 'input' | 'verify' | 'complete';

export function FindAccountPage() {
  const searchParams = useSearchParams();
  const initialTabType = (searchParams.get('type') as TabType) || 'id';

  const [activeTab, setActiveTab] = useState<TabType>(initialTabType);
  const [step, setStep] = useState<StepType>('input');
  const [errorInfo, setErrorInfo] = useState<string | null>(null);
  const [email, setEmail] = useState<string>('');
  const [remainingTime, setRemainingTime] = useState<number>(180); // 3분 (초 단위)
  const [foundId, setFoundId] = useState<string>('');

  // API 훅
  const { mutate: sendOtp, isPending: isSendingOtp } = useSendOtp();
  const { mutate: findId } = useFindId();
  const { mutate: findPassword, isPending: isFindingPassword } = useFindPassword();
  const { mutate: checkOtp, isPending: isCheckingOtp } = useCheckOtp();

  // 폼
  const findIdForm = useForm<FindIdFormType>({
    resolver: zodResolver(FindIdFormSchema),
    defaultValues: {
      userEmail: '',
    },
  });

  const findPasswordForm = useForm<FindPasswordFormType>({
    resolver: zodResolver(FindPasswordFormSchema),
    defaultValues: {
      userId: '',
      email: '',
    },
  });

  const verifyOtpForm = useForm<VerifyOtpFormType>({
    resolver: zodResolver(VerifyOtpFormSchema),
    defaultValues: {
      inputOtp: '',
    },
  });

  // 폼 값이 변경될 때 에러 정보 초기화
  findIdForm.watch(() => setErrorInfo(null));
  findPasswordForm.watch(() => setErrorInfo(null));
  verifyOtpForm.watch(() => setErrorInfo(null));

  // OTP 인증 타이머
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (step === 'verify' && remainingTime > 0) {
      timer = setInterval(() => {
        setRemainingTime(prev => prev - 1);
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [step, remainingTime]);

  // 남은 시간을 MM:SS 형식으로 포맷
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 탭 변경 처리
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setStep('input');
    setErrorInfo(null);
    setRemainingTime(180);
    setIsOtpVerified(false);
  };

  // 아이디 찾기 폼 제출 처리
  const onFindIdSubmit = async (data: FindIdFormType) => {
    setErrorInfo(null);
    setEmail(data.userEmail);

    const payload = {
      otpPurpose: 'FIND_ID',
      userEmail: data.userEmail,
    };

    sendOtp(payload, {
      onSuccess: response => {
        if (response.status === 'SUCCESS') {
          setStep('verify');
          setRemainingTime(180); // 타이머 초기화
        } else {
          setErrorInfo(response.message || '이메일 발송에 실패했습니다. 다시 시도해주세요.');
        }
      },
      onError: error => {
        setErrorInfo(error.message || '이메일 발송에 실패했습니다. 다시 시도해주세요.');
      },
    });
  };

  // 비밀번호 찾기 폼 제출 처리
  const onFindPasswordSubmit = async (data: FindPasswordFormType) => {
    setErrorInfo(null);
    setEmail(data.email);

    const payload = {
      userId: data.userId,
      email: data.email,
    };

    findPassword(payload, {
      onSuccess: response => {
        if (response.status === 'SUCCESS') {
          setStep('complete');
        } else {
          setErrorInfo(response.message || '임시 비밀번호 발송에 실패했습니다. 다시 시도해주세요.');
        }
      },
      onError: error => {
        setErrorInfo(error.message || '임시 비밀번호 발송에 실패했습니다. 다시 시도해주세요.');
      },
    });
  };

  // OTP 인증 상태
  const [isOtpVerified, setIsOtpVerified] = useState<boolean>(false);
  // OTP 입력값이 유효한지 확인 (6자리 숫자)
  const [isOtpInputValid, setIsOtpInputValid] = useState<boolean>(false);

  // OTP 인증 처리
  const onVerifyOtpSubmit = async (data: VerifyOtpFormType) => {
    setErrorInfo(null);

    if (remainingTime <= 0) {
      setErrorInfo('인증 시간이 만료되었습니다. 다시 시도해주세요.');
      return;
    }

    const otpPayload = {
      otpPurpose: 'FIND_ID',
      email: email,
      inputOtp: data.inputOtp,
    };

    checkOtp(otpPayload, {
      onSuccess: response => {
        if (response.status === 'SUCCESS' && response.data) {
          // OTP 인증 완료
          setIsOtpVerified(true);

          // checkCode 가져오기
          const checkCode = response.data.checkCode;

          // OTP 인증 후 아이디 찾기
          const findIdPayload = {
            code: checkCode, // checkOtp 응답에서 받은 checkCode 사용
            userEmail: email,
          };

          findId(findIdPayload, {
            onSuccess: response => {
              if (response.status === 'SUCCESS' && response.data) {
                const userData = response.data;
                setFoundId(userData.userId);
                setStep('complete');
              } else {
                setErrorInfo(response.message || '아이디 찾기에 실패했습니다. 다시 시도해주세요.');
                setIsOtpVerified(false);
              }
            },
            onError: error => {
              setErrorInfo(error.message || '아이디 찾기에 실패했습니다. 다시 시도해주세요.');
              setIsOtpVerified(false);
            },
          });
        } else {
          setErrorInfo(response.message || '인증번호가 일치하지 않습니다. 다시 확인해주세요.');
          setIsOtpVerified(false);
        }
      },
      onError: error => {
        setErrorInfo(error.message || '인증번호가 일치하지 않습니다. 다시 확인해주세요.');
        setIsOtpVerified(false);
      },
    });
  };

  // OTP 재발송
  const handleResendOtp = () => {
    const payload = {
      otpPurpose: 'FIND_ID',
      userEmail: email,
    };

    sendOtp(payload, {
      onSuccess: response => {
        if (response.status === 'SUCCESS') {
          setRemainingTime(180); // 타이머 초기화
          setErrorInfo(null);
          setIsOtpVerified(false); // 인증 상태 초기화
        } else {
          setErrorInfo(response.message || '이메일 재발송에 실패했습니다. 다시 시도해주세요.');
        }
      },
      onError: error => {
        setErrorInfo(error.message || '이메일 재발송에 실패했습니다. 다시 시도해주세요.');
      },
    });
  };

  // 아이디 찾기 폼 렌더링
  const renderIdFindingForm = () => (
    <Form {...findIdForm}>
      <form onSubmit={findIdForm.handleSubmit(onFindIdSubmit)} className="flex w-full flex-col">
        <div className="mb-[20px] flex gap-2">
          <FormField
            control={findIdForm.control}
            name="userEmail"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    placeholder="이메일을 입력해주세요."
                    {...field}
                    className="h-[50px]"
                    status={findIdForm.formState.errors.userEmail ? 'error' : undefined}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button
            size="lg"
            className="h-[50px] min-w-[120px] whitespace-nowrap rounded-md px-4"
            isLoading={isSendingOtp}
            type={step === 'verify' ? 'button' : 'submit'}
            onClick={() => {
              if (step === 'verify') {
                // 인증 단계에서 다시 입력 단계로 돌아가기
                setStep('input');
                setRemainingTime(180);
              }
            }}
          >
            인증메일 발송
          </Button>
        </div>

        {/* OTP 인증 입력 - 인증 단계에서만 표시 */}
        {step === 'verify' && activeTab === 'id' && (
          <div className="mb-[20px] flex gap-2">
            <div className="relative flex-1">
              <FormField
                control={verifyOtpForm.control}
                name="inputOtp"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="인증번호를 입력해주세요."
                        {...field}
                        className={`h-[50px] border-[#8f8f8f] ${isOtpVerified ? 'border-[#FF4500]' : ''}`}
                        status={verifyOtpForm.formState.errors.inputOtp ? 'error' : undefined}
                        onChange={e => {
                          field.onChange(e);
                          // 입력값이 6자리 숫자인지 확인
                          const value = e.target.value;
                          setIsOtpInputValid(/^\d{6}$/.test(value));
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className={`absolute right-4 top-1/2 -translate-y-1/2 text-[#FF4500]`}>
                {formatTime(remainingTime)}
              </div>
            </div>
            <Button
              size="lg"
              className={`h-[50px] min-w-[120px] whitespace-nowrap rounded-md px-4 ${isOtpInputValid ? 'bg-[#FF4500]' : 'bg-[#d4d4d4]'} text-white`}
              isLoading={isCheckingOtp}
              onClick={verifyOtpForm.handleSubmit(onVerifyOtpSubmit)}
              type="button"
              disabled={!isOtpInputValid}
            >
              인증번호 확인
            </Button>
          </div>
        )}

        {step === 'verify' && activeTab === 'id' && (
          <div className="mb-4 text-sm">
            <span className="cursor-pointer text-gray-600 underline underline-offset-[3px]" onClick={handleResendOtp}>
              인증번호를 받지 못하셨나요?
            </span>
          </div>
        )}

        <div className="mb-6 min-h-[60px]">
          {errorInfo && (
            <Alert variant="error" className="break-all">
              {errorInfo}
            </Alert>
          )}
        </div>
      </form>
    </Form>
  );

  // 비밀번호 찾기 폼 렌더링
  const renderPasswordFindingForm = () => (
    <Form {...findPasswordForm}>
      <form onSubmit={findPasswordForm.handleSubmit(onFindPasswordSubmit)} className="flex w-full flex-col">
        <div className="mb-[20px] flex gap-2">
          <FormField
            control={findPasswordForm.control}
            name="userId"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    placeholder="아이디를 입력해주세요."
                    {...field}
                    className="h-[50px]"
                    status={findPasswordForm.formState.errors.userId ? 'error' : undefined}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="mb-[20px] flex gap-2">
          <FormField
            control={findPasswordForm.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    placeholder="이메일을 입력해주세요."
                    {...field}
                    className="h-[50px]"
                    status={findPasswordForm.formState.errors.email ? 'error' : undefined}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button
            size="lg"
            className="h-[50px] min-w-[120px] whitespace-nowrap rounded-md px-4"
            isLoading={isFindingPassword}
          >
            인증메일 발송
          </Button>
        </div>
        <div className="mb-6 min-h-[60px]">
          {errorInfo && (
            <Alert variant="error" className="break-all">
              {errorInfo}
            </Alert>
          )}
        </div>
      </form>
    </Form>
  );

  // 아이디 찾기 성공 화면 렌더링
  const renderIdFoundSuccess = () => (
    <div className="mx-auto flex w-full max-w-[425px] flex-col items-center">
      <div className="mb-6 mt-8 text-[#FF4500]">
        <Icons.check className="h-16 w-16" />
      </div>
      <h2 className="mb-4 text-2xl font-bold">아이디 찾기 완료</h2>
      <p className="mb-8 text-center text-gray-600">검색결과 아이디는 아래와 같습니다.</p>

      <div className="mb-12 w-full bg-[#FFF4EF] py-6 text-center text-xl font-medium text-[#FF4500]">{foundId}</div>

      <div className="flex w-full gap-4">
        <Button variant="outline" size="lg" className="h-[50px] flex-1 rounded-md text-[18px] font-bold" asChild>
          <Link href="/login">로그인</Link>
        </Button>
        <Button size="lg" className="h-[50px] flex-1 rounded-md text-[18px] font-bold" asChild>
          <Link href="/find?type=password">비밀번호 재설정</Link>
        </Button>
      </div>
    </div>
  );

  // 비밀번호 재설정 성공 화면 렌더링
  const renderPasswordResetSuccess = () => (
    <div className="mx-auto flex w-full max-w-[425px] flex-col items-center">
      <div className="mb-6 mt-8 text-[#FF4500]">
        <Icons.send className="h-16 w-16" />
      </div>
      <h2 className="mb-4 text-2xl font-bold">임시비밀번호를 해당 메일로 보냈습니다.</h2>
      <p className="mb-8 text-center text-gray-600">보낸 메일을 통해 10분 내로 비밀번호를 재설정해주세요.</p>

      <Button size="lg" className="h-[50px] w-full rounded-md text-[18px] font-bold" asChild>
        <Link href="/login">로그인하러 가기</Link>
      </Button>
    </div>
  );

  return (
    <div className="mx-auto flex h-full w-full flex-col items-center py-[100px]">
      <div className="w-full max-w-[720px]">
        {step !== 'complete' && (
          <div className="flex flex-col items-center justify-center">
            <h1 className="mb-2 text-[28px] font-bold">아이디/비밀번호 찾기</h1>
            <p className="mb-8 text-center text-gray-600">
              회원가입 시 등록한 이메일을 인증하여 아이디를 찾을 수 있습니다.
            </p>
          </div>
        )}

        {/* 탭 네비게이션 */}
        {step === 'input' && (
          <Tabs value={activeTab} onValueChange={value => handleTabChange(value as TabType)} className="w-full">
            <TabsList className="mb-8 flex h-auto w-full bg-transparent p-0">
              <TabsTrigger
                value="id"
                className="flex-1 rounded-none border-b-2 pb-4 text-lg font-medium data-[state=active]:border-[#FF4500] data-[state=inactive]:border-gray-200 data-[state=active]:bg-transparent data-[state=active]:text-[#FF4500] data-[state=inactive]:text-gray-400 data-[state=active]:shadow-none"
              >
                아이디 찾기
              </TabsTrigger>
              <TabsTrigger
                value="password"
                className="flex-1 rounded-none border-b-2 pb-4 text-lg font-medium data-[state=active]:border-[#FF4500] data-[state=inactive]:border-gray-200 data-[state=active]:bg-transparent data-[state=active]:text-[#FF4500] data-[state=inactive]:text-gray-400 data-[state=active]:shadow-none"
              >
                비밀번호 찾기
              </TabsTrigger>
            </TabsList>

            <TabsContent value="id" className="mt-0">
              {renderIdFindingForm()}
            </TabsContent>
            <TabsContent value="password" className="mt-0">
              {renderPasswordFindingForm()}
            </TabsContent>
          </Tabs>
        )}

        {/* 현재 단계와 탭에 따른 콘텐츠 (입력 단계가 아닌 경우) */}
        {step !== 'input' && (
          <>
            {step === 'verify' && activeTab === 'id' && renderIdFindingForm()}
            {step === 'verify' && activeTab === 'password' && renderPasswordFindingForm()}
            {step === 'complete' && activeTab === 'id' && renderIdFoundSuccess()}
            {step === 'complete' && activeTab === 'password' && renderPasswordResetSuccess()}
          </>
        )}
      </div>
    </div>
  );
}
