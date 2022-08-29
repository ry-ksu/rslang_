export type AuthOption = 'signIn' | 'signUp';
export type SignUpOptions = 'name' | 'email' | 'password';
export type checkValueFn = (value: string) => boolean;
export interface IToken {
  exp: number;
  iat: number;
  id: string;
}
