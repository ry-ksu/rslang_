import { hidePopup, showPopup, togglePopupState } from './togglePopupState';
import renderAuth from './view';
import authorization from './auth';
import WordsApi from '../../services/wordsAPI';
import LocalStorage from '../../services/store';

export default class ControllerAuthorization {
  api: WordsApi;

  localStoarge: LocalStorage;

  constructor(api: WordsApi, localStorage: LocalStorage) {
    this.api = api;
    this.localStoarge = localStorage;
  }

  public renderAuth(): void {
    renderAuth();
    togglePopupState();
    hidePopup();
    showPopup();
  }

  public authorization(): void {
    authorization(this.api, this.localStoarge);
  }

  public async checkAuth(): Promise<void> {
    const LS = this.localStoarge.getLS();
    if (Object.keys(LS).length > 0) {
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

  public async tryRefresh(userID: string, refreshToken: string): Promise<void> {
    try {
      const newToken: {
        token: string;
        refreshToken: string;
      } = await this.api.getNewUserToken({ userID, refreshToken });
      this.localStoarge.changeLS('token', newToken.token);
      this.localStoarge.changeLS('refreshToken', newToken.refreshToken);
    } catch (err) {
      throw new Error("can't refresh", err as Error);
    }
  }
}
