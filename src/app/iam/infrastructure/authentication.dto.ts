export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignInResponse {
  id: number;
  email: string;
  fullName: string;
  token: string;
}
