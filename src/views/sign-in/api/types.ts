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
  tempCode: string;
  userEmail: string;
}

export interface FindPasswordRequest {
  userId: string;
  email: string;
}

export interface FindIdRequest {
  code: string;
  userEmail: string;
}

export interface CheckOtpRequest {
  otpPurpose: string; // SIGN_UP, FIND_ID
  tempCode: string;
  email: string;
  inputOtp: string;
}

export interface ChangePasswordRequest {
  password: string;
  newPassword: string;
  newConfirmPassword: string;
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
