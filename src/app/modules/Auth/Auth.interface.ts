export interface ILoginUser {
  email: string;
  password: string;
}

export interface IResetPassword {
  email: string;
  token: string;
  newPassword: string;
}
