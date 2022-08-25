import ViewAbout from './view';

export default class ControllerAbout {
  component: HTMLElement;

  viewAbout: ViewAbout;

  constructor(component: HTMLElement) {
    this.component = component;
    this.viewAbout = new ViewAbout();
  }

  getData() {
    this.viewAbout.drewTeamCards(this.component);
  }
}
