import ViewMainPage from './view';

export default class ControllerAbout {
  viewMainPage: ViewMainPage;

  constructor() {
    this.viewMainPage = new ViewMainPage();
  }

  getDate(component: HTMLElement) {
    this.viewMainPage.drewMain(component);
  }
}
