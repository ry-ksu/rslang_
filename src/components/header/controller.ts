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
        this.controllerAuthorization.getData(this.render);
      }
      this.controllerAuthorization.checkAuth().catch((err) => console.log(err));
    } else if ((e.target as HTMLElement).hasAttribute('data-logout')) {
      this.attributes.localStorage.deleteUserData();
      this.render();
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

  getData(isUserAuth: boolean) {
    this.detachEvents();
    this.viewHeader.drawHeader(isUserAuth);
    this.attachEvents();
  }

  goToPage(e: Event) {
    if (e.target instanceof HTMLElement) {
      const page = e.target.getAttribute('data-page') as string;
      this.changePage(page);
    }
  }
}
