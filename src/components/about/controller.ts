import { IAttributes } from '../types/types';
import ViewAbout from './view';

export default class ControllerAbout {
  viewAbout: ViewAbout;

  attributes: IAttributes;

  constructor(attributes: IAttributes) {
    this.attributes = attributes;
    this.viewAbout = new ViewAbout();
  }

  getData() {
    this.viewAbout.drawTeamCards(this.attributes.component);
  }
}
