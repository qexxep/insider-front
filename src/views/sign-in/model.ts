import { z } from 'zod';

export const LoginFormSchema = z.object({
  userId: z.string().min(1, { message: '아이디를 입력해주세요.' }),
  password: z.string().min(1, { message: '비밀번호를 입력해주세요.' }),
});

export type LoginFormType = z.infer<typeof LoginFormSchema>;

export const SignupFormSchema = z
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

export type SignupFormType = z.infer<typeof SignupFormSchema>;
