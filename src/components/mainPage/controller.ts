import ViewMainPage from './view';

export default class ControllerMainPage {
  views: {
    mainPage: ViewMainPage;
  }

  constructor() {
    this.views = {
      mainPage: new ViewMainPage(),
    }
  }

  getData(token?: string, userName?: string) {
    let auth = false;
    if (token) {
      // Нужно будет обратиться к контроллеру авторизации для проверки токена
      // Сейчас поставила заплатку
      // добавить async / await
      auth = this.checkAuth(token);
    }
    this.views.mainPage.drewHeader(auth, userName);
  }

  checkAuth(token: string) {
    if (Math.random() > 0.5) {
      return true;
    }
    return false;
  }
}
