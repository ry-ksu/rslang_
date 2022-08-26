import { hidePopup, showPopup, togglePopupState } from "./togglePopupState";
import renderAuth from "./view";
import authenification from './auth';

export default class Auth {
  public renderAuth(): void {
    renderAuth();
    togglePopupState();
    hidePopup();
    showPopup();
  }

  public authenification(): void {
    authenification();
  }
}