import { z } from 'zod';

export const tempCodeSchema = z
  .string()
  .regex(/^\d{1,6}$/, { message: '인증번호는 숫자만 입력 가능하며, 최대 6자리입니다.' })
  .min(1, { message: '인증번호를 입력해 주세요.' })
  .max(6, { message: '인증번호는 최대 6자리까지 가능합니다.' });

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
      .max(12, { message: '닉네임은 최대 12자 이하여야 합니다.' })
      .regex(/^[a-zA-Z0-9가-힣]+$/, { message: '닉네임은 영문, 숫자, 한글만 사용할 수 있습니다.' }),
    userId: z
      .string()
      .min(4, { message: '아이디는 최소 4자 이상이어야 합니다.' })
      .max(20, { message: '아이디는 최대 20자 이하여야 합니다.' })
      .regex(/^[A-Za-z0-9]+$/, { message: '아이디는 영문자와 숫자만 사용할 수 있습니다.' })
      .regex(/[A-Za-z]/, { message: '아이디에는 최소 한 개의 영문자가 포함되어야 합니다.' }),
    password: z
      .string()
      .min(8, { message: '비밀번호는 최소 8자 이상이어야 합니다.' })
      .max(20, { message: '비밀번호는 최대 20자 이하여야 합니다.' })
      .regex(/[A-Za-z]/, { message: '비밀번호에는 최소 한 개의 영문자가 포함되어야 합니다.' })
      .regex(/[0-9]/, { message: '비밀번호에는 최소 한 개의 숫자가 포함되어야 합니다.' })
      .regex(/[!@#$%^&*()]/, { message: '비밀번호에는 최소 한 개의 특수문자(!@#$%^&*())가 포함되어야 합니다.' }),
    confirmPassword: z.string(),
    email: z.string().email({ message: '이메일 형식에 맞지 않습니다.' }),
    // tempCode: tempCodeSchema,
    birthDate: z.string().regex(/[0-9]/).length(8),
    gender: z.enum(['M', 'F', 'other'], {
      required_error: '성별을 선택해 주세요.',
    }),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['confirmPassword'],
  });

export type SignupFormType = z.infer<typeof SignupFormSchema>;
