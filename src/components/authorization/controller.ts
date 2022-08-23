import { hidePopup, showPopup, togglePopupState } from "./togglePopupState";
import renderAuth from "./view";

export default class Auth {
  public renderAuth(): void {
    renderAuth();
    togglePopupState();
    hidePopup();
    showPopup();
  }
}