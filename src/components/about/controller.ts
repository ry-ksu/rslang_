import ViewAbout from './view';

export default class ControllerAbout {
  viewAbout: ViewAbout;

  constructor() {
    this.viewAbout = new ViewAbout();
  }

  getDate(component: HTMLElement) {
    this.viewAbout.drewTeamCards(component);
  }
}
