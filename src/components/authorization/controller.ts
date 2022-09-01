import { hidePopup, showPopup, togglePopupState } from './togglePopupState';
import renderAuth from './view';
import authorization from './auth';
import WordsApi from '../../services/wordsAPI';
import LocalStorage from '../../services/store';
import { IAttributes, voidFn } from '../types/types';

export default class ControllerAuthorization {
  api: WordsApi;

  localStoarge: LocalStorage;

  render: voidFn;

  constructor(attrs: IAttributes, callback: voidFn) {
    this.api = attrs.wordsApi;
    this.localStoarge = attrs.localStorage;
    this.render = callback;
  }

  public getData(): void {
    this.renderAuth();
    this.authorization(this.render);
  }

  private renderAuth(): void {
    renderAuth();
    togglePopupState();
    hidePopup();
    showPopup();
  }

  private authorization(callback: voidFn): void {
    authorization(this.api, this.localStoarge, callback);
  }

  public async checkAuth(): Promise<void> {
    const LS = this.localStoarge.getLS();
    if ('token' in LS && LS.token.length > 0) {
      const { userId: userID, token, refreshToken } = LS;
      try {
        await this.api.getUser({ userID, token });
      } catch (err) {
        await this.tryRefresh(userID, refreshToken);
      }
    } else {
      throw new Error('unauthorized');
    }
  }

  private async tryRefresh(userID: string, refreshToken: string): Promise<void> {
    try {
      const newToken: {
        token: string;
        refreshToken: string;
      } = await this.api.getNewUserToken({ userID, refreshToken });
      this.localStoarge.changeLS('token', newToken.token);
      this.localStoarge.changeLS('refreshToken', newToken.refreshToken);
    } catch (err) {
      this.localStoarge.deleteUserData();
      this.localStoarge.changeLS('page', 'mainPage');
      this.render();
      throw new Error("can't refresh", err as Error);
    }
  }
}
