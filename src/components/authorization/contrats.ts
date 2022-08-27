export type AuthOption = 'signIn' | 'signUp';
export type SignUpOptions = 'name' | 'mail' | 'password';
export type checkValueFn = (value: string) => boolean;
export interface ITocen {
  exp: number;
  iat: number;
  id: string;
}
