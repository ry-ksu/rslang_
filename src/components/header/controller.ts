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
      this.controllerAuthorization.checkAuth().catch((err) => console.log(err));
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
      this.showBurgerMenu.bind(this)
    );
  }

  showBurgerMenu() {
    const iconMenu = document.querySelector('.menu__icon') as HTMLElement;
    const bodyMenu = document.querySelector('.menu__body') as HTMLElement;
    // const header = document.querySelector('.header') as HTMLElement;

    // if (!(document.querySelector('.menu__outside'))) {
    //   const outsideMenu = document.createElement('div');
    //   outsideMenu.className = 'menu__outside _active';
    //   outsideMenu.append(header);
    //   document.body.append(outsideMenu);
    // } else {
    //   document.body.prepend(header);
    //   (document.querySelector('.menu__outside') as HTMLElement).remove();
    // }

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
      const page = (e.target as HTMLElement).getAttribute('data-page') as string;
      this.changePage(page);
    }
  }
}
