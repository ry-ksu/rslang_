import ViewStatistics from './view';
import { IAttributes } from '../types/types';

export default class ControllerStatistics {
  private viewStatistics: ViewStatistics;

  private attributes: IAttributes;

  constructor(attributes: IAttributes) {
    this.attributes = attributes;
    this.viewStatistics = new ViewStatistics({ controller: this, component: attributes.component });
  }

  async getData() {
    const isUserRegistered = this.attributes.isUserAuth;
    const { token, userId: userID } = this.attributes.localStorage.getLS();
    if (isUserRegistered) {
      try {
        const statistics = await this.attributes.wordsApi.getUserStatistics({ userID, token });
        this.viewStatistics.draw({ statistics });
      } catch (error) {
        console.error(error);
      }
    } else {
      this.viewStatistics.showInvitation();
    }
  }
}
