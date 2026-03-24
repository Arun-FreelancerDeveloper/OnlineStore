export interface UserCreation {
  fullname: string;
  email: string;
  passwordhash: string;
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
