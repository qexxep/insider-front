'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui';

import { LOGIN_REQUIRED_EVENT } from './consts';

export function LoginRequiredModal() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleLoginRequired = () => {
      setIsOpen(true);
    };

    window.addEventListener(LOGIN_REQUIRED_EVENT, handleLoginRequired);
    return () => {
      window.removeEventListener(LOGIN_REQUIRED_EVENT, handleLoginRequired);
    };
  }, []);

  const handleLogin = () => {
    const currentPath = window.location.pathname;
    router.push(`/login?returnUrl=${encodeURIComponent(currentPath)}`);
    setIsOpen(false);
  };

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="w-[671px]">
        <AlertDialogHeader>
          <AlertDialogTitle>로그인이 필요합니다.</AlertDialogTitle>
          <AlertDialogDescription>(디자인 시안 필요)</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className="m-auto h-[70px] w-[196px] rounded-[35px] text-lg font-bold"
            onClick={() => setIsOpen(false)}
          >
            취소
          </AlertDialogCancel>
          <AlertDialogAction
            className="m-auto h-[70px] w-[196px] rounded-[35px] text-lg font-bold"
            onClick={handleLogin}
          >
            로그인하기
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
