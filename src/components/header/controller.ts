import ViewHeader from './view';
import { IAttributes } from '../types/types';
import ControllerAuthorization from '../authorization/controller';

export default class ControllerHeader {
  render: () => void;

  changePage: (page: string) => void;

  viewHeader: ViewHeader;

  attributes: IAttributes;

  controllerAuthorization: ControllerAuthorization;

  constructor(
    render: () => void,
    attributes: IAttributes,
    changePage: (page: string) => void,
    controllerAuthorization: ControllerAuthorization
  ) {
    this.render = render;
    this.viewHeader = new ViewHeader();
    this.changePage = changePage;
    this.attributes = attributes;
    this.controllerAuthorization = controllerAuthorization;
  }

  defineLoginLogout(e: Event) {
    if ((e.target as HTMLElement).hasAttribute('data-login')) {
      if (!document.querySelector('.outside')) {
        this.controllerAuthorization.getData();
      }
      this.controllerAuthorization
        .checkAuth()
        .catch(() => console.log());
    } else if ((e.target as HTMLElement).hasAttribute('data-logout')) {
      this.attributes.localStorage.deleteUserData();
      this.attributes.localStorage.changeLS('page', 'mainPage');
      this.render();
    }
  }

  attachEvents() {
    (document.querySelector('.menu__list') as HTMLElement).addEventListener(
      'click',
      this.goToPage.bind(this)
    );
    (document.querySelector('.user-area') as HTMLElement).addEventListener(
      'click',
      this.defineLoginLogout.bind(this)
    );
    (document.querySelector('.logo') as HTMLElement).addEventListener(
      'click',
      this.goToMain.bind(this)
    );
    (document.querySelector('.menu__icon') as HTMLElement).addEventListener(
      'click',
      this.showBurgerMenu
    );
  }

  showBurgerMenu = () => {
    const iconMenu = document.querySelector('.menu__icon') as HTMLElement;
    const bodyMenu = document.querySelector('.menu__body') as HTMLElement;

    document.body.classList.toggle('_lock');
    iconMenu.classList.toggle('_active');
    bodyMenu.classList.toggle('_active');
  }

  goToMain() {
    this.changePage('mainPage');
  }

  detachEvents() {
    const nav = document.querySelector('.menu__list');

    if (nav) {
      (document.querySelector('.menu__list') as HTMLElement).removeEventListener(
        'click',
        this.goToPage.bind(this)
      );
    }  
  }

  getData(isUserAuth: boolean) {
    this.detachEvents();
    this.viewHeader.drawHeader(isUserAuth);
    this.attachEvents();
  }

  goToPage(e: Event) {
    if ((e.target as HTMLElement).getAttribute('data-page')) {
      (document.querySelector('body') as HTMLElement).className = '';
      const page = (e.target as HTMLElement).getAttribute('data-page') as string;
      window.location.reload();
      this.changePage(page);
    }
  }
}
