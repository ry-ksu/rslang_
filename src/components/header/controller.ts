import ViewHeader from './view';

export default class ControllerHeader {
  viewHeader: ViewHeader;

  constructor() {
    this.viewHeader = new ViewHeader();
  }

  getData(token?: string) {
    // static

    let auth = false;
    if (token) {
      // Нужно будет обратиться к контроллеру авторизации для проверки токена
      // Сейчас поставила заплатку
      // добавить async / await
      auth = this.checkAuth(token);
    }
    this.viewHeader.drewHeader(auth);
  }

  checkAuth(token: string) {
    /*
    if (Math.random() > 0.5) {
      return true;
    }
    */
    return false;
  }
}
