// Auth

export interface SignInRequest {
  userId: string;
  password: string;
}

export interface SignInResponse {
  jwt: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface SendOtpRequest {
  otpPurpose: string; // SIGN_UP, FIND_ID
  tempCode?: string; // tempCode는 SIGN_UP에서만 사용하고 FIND_ID에서 사용하지 않음
  userEmail: string;
}

export interface FindPasswordRequest {
  userId: string;
  email: string;
}

export interface FindIdRequest {
  code: string; // checkCode
  userEmail: string;
}
export interface FindIdResponse {
  userId: string;
}

export interface CheckOtpRequest {
  otpPurpose: string; // SIGN_UP, FIND_ID
  tempCode?: string; // tempCode는 SIGN_UP에서만 사용하고 FIND_ID에서 사용하지 않음
  email: string;
  inputOtp: string;
}

export interface CheckOtpResponse {
  checkCode: string;
}

export interface ChangePasswordRequest {
  password: string; // 현재 비밀번호 또는 현재 임시비밀번호
  newPassword: string; // 영문 + 숫자 +특수문자 7자이상 18자 이하
  newConfirmPassword: string; // 영문 + 숫자 + 특수문자 7자이상 18자 이하
}
// Registers

export interface SignUpRequest {
  tempCode: string;
  userId: string;
  password: string;
  confirmPassword: string;
  nickName: string;
  email: string;
  birthDate: string;
  gender: string; // M, F
}

export interface SignUpInitResponse {
  tempCode: string;
}

export interface CheckDuplicateNicknameRequest {
  tempCode: string;
  userNickname: string;
}

export interface CheckDuplicateIdRequest {
  tempCode: string;
  userId: string;
}
