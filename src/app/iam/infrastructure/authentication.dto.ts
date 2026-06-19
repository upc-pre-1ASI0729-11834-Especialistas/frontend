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

export interface SignUpRequest {
  email: string;
  password: string;
  fullName: string;
  roles: string[];
}
