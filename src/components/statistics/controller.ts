import ViewStatistics from './view';
import { IAttributes } from '../types/types';
import App from '../app';

export default class ControllerStatistics {
  private viewStatistics: ViewStatistics;

  private attributes: IAttributes;

  private app: App;

  constructor(app: App) {
    this.app = app;
    this.attributes = app.attributes;
    this.viewStatistics = new ViewStatistics({
      controller: this,
      component: this.attributes.component,
    });
  }

  async getData() {
    const isUserRegistered = this.attributes.isUserAuth;
    const { token, userId: userID } = this.attributes.localStorage.getLS();
    if (isUserRegistered) {
      this.app.controllerLoader.showLoader();
      try {
        const statistics = await this.attributes.wordsApi.getUserStatistics({ userID, token });
        this.viewStatistics.draw({ statistics });
      } catch (error) {
        console.error(error);
      } finally {
        this.app.controllerLoader.hideLoader();
      }
    } else {
      this.viewStatistics.showInvitation();
    }
  }
}
