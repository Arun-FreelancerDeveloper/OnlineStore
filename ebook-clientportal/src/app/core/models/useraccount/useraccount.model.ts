export interface UserCreationModel {
  fullname: string;
  email: string;
  password: string;
  userType : string,
  vendorNumber : string
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  userid: number;
  fullname: string;
  email: string;
  token: string;
  expiresIn: number;
}


export interface ForgotPasswordRequest {
  email: string;
  callbackurl: string;
}


export interface ResetPasswordRequest {
  token: string;
  newpassword: string;
  confirmPassword : string;
}
