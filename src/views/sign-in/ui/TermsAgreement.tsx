import { useReducer } from 'react';

import { cn } from '@/shared/lib';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  Icons,
} from '@/shared/ui';

type State = { terms1: boolean; terms2: boolean };
type Action = { type: 'TOGGLE_ALL' } | { type: 'TOGGLE_TERM'; term: keyof State };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'TOGGLE_ALL': {
      const newChecked = !(state.terms1 && state.terms2);
      return { terms1: newChecked, terms2: newChecked };
    }
    case 'TOGGLE_TERM':
      return { ...state, [action.term]: !state[action.term] };
    default:
      return state;
  }
};

export const TermsAgreement = () => {
  const [state, dispatch] = useReducer(reducer, { terms1: false, terms2: false });
  const allChecked = state.terms1 && state.terms2;
  return (
    <div className="flex flex-col gap-7">
      <label className="flex cursor-pointer items-center gap-3 text-xl font-bold text-[#343434]">
        <input
          type="checkbox"
          checked={allChecked}
          onChange={() => dispatch({ type: 'TOGGLE_ALL' })}
          className="sr-only"
        />
        <Icons.checkCircleFilled className={cn('h-[30px] w-[30px]', allChecked ? 'text-primary' : 'text-gray-400')} />
        모든 약관에 동의합니다.
      </label>
      <div className="flex items-center justify-between">
        <label htmlFor="terms1" className="flex cursor-pointer text-lg text-gray-700">
          <input
            id="terms1"
            type="checkbox"
            checked={state.terms1}
            onChange={() => dispatch({ type: 'TOGGLE_TERM', term: 'terms1' })}
            className="sr-only"
          />
          <Icons.check className={cn('mr-3 h-[28px] w-[28px]', state.terms1 ? 'text-primary' : 'text-gray-400')} />
          <span className="mr-1 font-bold text-primary">[필수]</span>
          인싸이더 홈페이지 이용약관 동의
        </label>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" className="[&_svg]:size-6">
              <Icons.chevronRight />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="w-[671px]">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-[32px] font-bold text-gray-700">이용약관</AlertDialogTitle>
              <AlertDialogDescription>
                <span className="text-xl text-gray-700">홈페이지 이용약관</span>
                <p className="font-normal text-[#616161]">
                  {`개인정보보호법에 따라 인싸이더에 회원가입 신청하시는 분께 수집하는 개인정보의 항목, 개인정보의 수집 및 이용목적, 개인정보의 보유 및 이용기간, 동의 거부권 및 동의 거부 시 불이익에 관한 사항을 안내 드리오니 자세히 읽은 후 동의하여 주시기 바랍니다.\n 제 1조 (목 적)\n 이 서비스 이용약관(이하 “약관”이라 합니다)은 네이트커뮤니케이션즈㈜(이하 “회사”라 합니다)가 제공하는 서비스와 관련하여 회사와 이용 고객(또는 회원) 간에 서비스의 이용 조건 및 절차, 회사와 회원 간의 권리, 의무 및 책임 사항 기타 필요한 사항을 규정함을 목적으로 합니다.`}
                </p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction asChild>
                <Button className="m-auto h-[70px] w-[350px] rounded-[35px] text-lg font-bold">확인</Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div className="flex items-center justify-between">
        <label htmlFor="terms2" className="flex cursor-pointer text-lg text-gray-700">
          <input
            id="terms2"
            type="checkbox"
            checked={state.terms2}
            onChange={() => dispatch({ type: 'TOGGLE_TERM', term: 'terms2' })}
            className="sr-only"
          />
          <Icons.check className={cn('mr-3 h-[28px] w-[28px]', state.terms2 ? 'text-primary' : 'text-gray-400')} />
          <span className="mr-1 font-bold text-primary">[필수]</span>
          개인정보 수집 및 이용
        </label>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" className="[&_svg]:size-6">
              <Icons.chevronRight />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="w-[671px]">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-[32px] font-bold text-gray-700">개인정보 수집 및 이용</AlertDialogTitle>
              <AlertDialogDescription className="font-normal text-[#616161]">
                <span className="block text-xl text-gray-700">개인정보 수집 및 이용</span>
                {`개인정보보호법에 따라 인싸이더에 회원가입 신청하시는 분께 수집하는 개인정보의 항목, 개인정보의 수집 및 이용목적, 개인정보의 보유 및 이용기간, 동의 거부권 및 동의 거부 시 불이익에 관한 사항을 안내 드리오니 자세히 읽은 후 동의하여 주시기 바랍니다.\n 제 1조 (목 적)\n 이 서비스 이용약관(이하 “약관”이라 합니다)은 네이트커뮤니케이션즈㈜(이하 “회사”라 합니다)가 제공하는 서비스와 관련하여 회사와 이용 고객(또는 회원) 간에 서비스의 이용 조건 및 절차, 회사와 회원 간의 권리, 의무 및 책임 사항 기타 필요한 사항을 규정함을 목적으로 합니다.`}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction asChild>
                <Button className="m-auto h-[70px] w-[350px] rounded-[35px] text-lg font-bold">확인</Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};
