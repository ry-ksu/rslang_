import ViewHeader from './view';
import { IAttributes } from '../types/types';

//! Подумать, как это передать из App
import ControllerAuthorization from '../authorization/controller';

export default class ControllerHeader {
  changePage: (page: string) => void;

  viewHeader: ViewHeader;

  attributes: IAttributes;

  //! Подумать, как это передать из App
  ControllerAuthorization: ControllerAuthorization;

  constructor(attributes: IAttributes, changePage: (page: string) => void) {
    this.viewHeader = new ViewHeader();
    // Это нужно сделать в каждом контроллере
    this.changePage = changePage;

    //! Подумать, как это передать из App
    this.attributes = attributes;
    this.ControllerAuthorization = new ControllerAuthorization(
      attributes.wordsApi,
      attributes.localStorage
    );
  }

  defineLoginLogout(e: Event) {
    if ((e.target as HTMLElement).hasAttribute('data-login')) {
      this.ControllerAuthorization.renderAuth();
      this.ControllerAuthorization.authorization();
      this.ControllerAuthorization.checkAuth().catch((err) => console.log(err));
    } else if ((e.target as HTMLElement).hasAttribute('data-logout')) {
      //
    }
  }

  attachEvents() {
    (document.querySelector('.nav') as HTMLElement).addEventListener(
      'click',
      this.goToPage.bind(this)
    );
    (document.querySelector('.user-area') as HTMLElement).addEventListener(
      'click',
      this.defineLoginLogout.bind(this)
    );
  }

  detachEvents() {
    const nav = document.querySelector('.nav');

    if (nav) {
      (document.querySelector('.nav') as HTMLElement).removeEventListener(
        'click',
        this.goToPage.bind(this)
      );
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
    if (e.target instanceof HTMLElement) {
      const page = e.target.getAttribute('data-page') as string;
      this.changePage(page);
    }
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
