import { ILocalStorage } from '../components/types/types';

export default class LocalStorage {
  getLS(): ILocalStorage {
    return (JSON.parse(localStorage.getItem('victory') as string) || {}) as ILocalStorage;
  }

  changeLS(name: string, value: string) {
    const LS = this.getLS();
    LS[name as keyof ILocalStorage] = value;
    localStorage.setItem('victory', JSON.stringify(LS));
  }

  deleteUserData() {
    const LS = this.getLS();
    LS.name = '';
    LS.token = '';
    LS.refreshToken = '';
    LS.userId = '';
    localStorage.setItem('victory', JSON.stringify(LS));
  }
}
