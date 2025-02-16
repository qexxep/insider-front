import { z } from 'zod';

export const LoginFormSchema = z.object({
  userId: z.string().min(1, { message: '아이디를 입력해주세요.' }),
  password: z.string().min(1, { message: '비밀번호를 입력해주세요.' }),
});

export type LoginFormType = z.infer<typeof LoginFormSchema>;

export const SignupFormSchema = z
  .object({
    nickName: z
      .string()
      .min(4, { message: '닉네임은 최소 4자 이상이어야 합니다.' })
      .max(12, { message: '닉네임은 최대 12자 이하여야 합니다.' }),
    userId: z
      .string()
      .min(4, { message: '아이디는 최소 4자 이상이어야 합니다.' })
      .max(20, { message: '아이디는 최대 12자 이하여야 합니다.' }),
    password: z
      .string()
      .min(8, { message: '비밀번호는 최소 8자 이상이어야 합니다.' })
      .max(20, { message: '비밀번호는 최대 20자 이하여야 합니다.' })
      .regex(/[A-Za-z]/, { message: '비밀번호에는 최소 한 개의 영문자가 포함되어야 합니다.' })
      .regex(/[0-9]/, { message: '비밀번호에는 최소 한 개의 숫자가 포함되어야 합니다.' })
      .regex(/[!@#$%^&*()]/, { message: '비밀번호에는 최소 한 개의 특수문자(!@#$%^&*())가 포함되어야 합니다.' }),
    confirmPassword: z.string(),
    email: z.string().email({ message: '이메일 형식에 맞지 않습니다.' }),
    tempCode: z
      .string()
      .length(6, { message: '인증번호는 6자리 숫자여야 합니다.' })
      .regex(/^\d{6}$/, { message: '인증번호는 숫자 6자리여야 합니다.' }),
    birthDate: z.string(),
    gender: z.enum(['M', 'F', 'other'], {
      required_error: '성별을 선택해 주세요.',
    }),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['confirmPassword'],
  });

export type SignupFormType = z.infer<typeof SignupFormSchema>;
