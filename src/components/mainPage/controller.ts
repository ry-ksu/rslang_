import { IAttributes } from '../types/types';
import ViewMainPage from './view';

export default class ControllerAbout {
  viewMainPage: ViewMainPage;

  attributes: IAttributes;

  constructor(attributes: IAttributes) {
    this.attributes = attributes;
    this.viewMainPage = new ViewMainPage();
  }

  getData() {
    this.viewMainPage.drawMain(this.attributes);
  }
}
