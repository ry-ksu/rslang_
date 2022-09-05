import { IAttributes } from '../types/types';
import ViewMainPage from './view';

export default class ControllerAbout {
  render: () => void;

  viewMainPage: ViewMainPage;

  attributes: IAttributes;

  constructor(attributes: IAttributes, render: () => void) {
    this.render = render;
    this.attributes = attributes;
    this.viewMainPage = new ViewMainPage();
  }

  attachEvents() {
    (document.querySelector('.main-block__game') as HTMLElement).addEventListener(
      'click',
      this.goToGame.bind(this)
    );
  }

  goToGame() {
    this.attributes.localStorage.changeLS('page', 'audioGame');
    this.render();
  }

  getData() {
    this.viewMainPage.drawMain(this.attributes);
    this.attachEvents();
  }
}
