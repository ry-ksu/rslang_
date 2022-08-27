import { hidePopup, showPopup, togglePopupState } from "./togglePopupState";
import renderAuth from "./view";
import authorization from './auth';
import WordsApi from "../../services/wordsAPI";
import Loader from "../../services/loader";
import { IUserToken } from "../types/types";

export default class Auth {
  api: WordsApi

  isAuth = false;

  constructor() {
    this.api = new WordsApi({ LoaderService: Loader });
  }

  public renderAuth(): void {
    renderAuth();
    togglePopupState();
    hidePopup();
    showPopup();
  }

  public authorization(): void {
    authorization(this.api, this.changeIsAuth.bind(this));
  }

  private changeIsAuth(value: boolean): void {
    this.isAuth = value;
  }

  public async checkAuth(): Promise<void> {
    if (localStorage.getItem('user')) {
      const userLocalStore = localStorage.getItem('user') ?? '{}';
      const user = JSON.parse(userLocalStore) as IUserToken;
      console.log(user);
      try {
        await this.api.getUser({ userID: user.userId, token: 'user.token' });
      } catch (err) {
        await this.tryRefresh(user);
      }
    } else {
      throw new Error('unauthorized');
    }
  }

  public async tryRefresh(user: IUserToken): Promise<void> {
    try {
      const newToken: IUserToken = await this.api.getNewUserToken({ 
        userID: user.userId,
        refreshToken: user.refreshToken 
      });
      console.log(newToken);
      localStorage.setItem('user', JSON.stringify(newToken));
    } catch(err) {
      localStorage.removeItem('user');
      throw new Error('can\'t refresh', err as Error);
    }
  }
}