import ViewMainPage from './view';

export default class ControllerAbout {
  component: HTMLElement;

  viewMainPage: ViewMainPage;

  constructor(component: HTMLElement) {
    this.component = component;
    this.viewMainPage = new ViewMainPage();
  }

  getData() {
    this.viewMainPage.drewMain(this.component);
  }
}
