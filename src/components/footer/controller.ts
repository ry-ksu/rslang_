import ViewFooter from './view';

export default class ControllerFooter {
  viewFooter: ViewFooter;

  constructor() {
    this.viewFooter = new ViewFooter();
  }

  getData() {
    this.viewFooter.drawFooter();
  }
}
