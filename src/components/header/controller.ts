import ViewHeader from './view';

export default class ControllerHeader {
  changePage: (page: string) => void;

  viewHeader: ViewHeader;

  constructor(changePage: (page: string) => void) {
    this.viewHeader = new ViewHeader();
    // Это нужно сделать в каждом контроллере
    this.changePage = changePage; 
  }

  attachEvents() {
    (document.querySelector('.nav') as HTMLElement).addEventListener('click', this.goToPage.bind(this));
  }

  detachEvents () {
    const nav = document.querySelector('.nav')

    if(nav) {
      (document.querySelector('.nav') as HTMLElement).removeEventListener('click', this.goToPage.bind(this));
    }
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
    this.detachEvents();
    this.viewHeader.drewHeader(auth);
    this.attachEvents();
  }

  goToPage(e: Event) {
    if(e.target instanceof HTMLElement) {
      const page = e.target.getAttribute('data-page') as string;
      this.changePage(page);
    }
  }

  checkAuth(token: string) {
    if (Math.random() > 0.5) {
      return true;
    }
    return false;
  }
}
