import ViewStatistics from "./view";
import { IAttributes } from "../types/types";

export default class ControllerStatistics {

  private viewStatistics: ViewStatistics;

  private attributes: IAttributes;

  constructor(attributes: IAttributes) {
    this.attributes = attributes;
    this.viewStatistics = new ViewStatistics(
      { controller: this, component: attributes.component }
    );
  }

  getData() {
    const isUserRegistered = this.attributes.isUserAuth;
    // const { token, userId: userID } = this.attributes.localStorage.getLS();
    if (isUserRegistered) {
      this.viewStatistics.draw();
    } else {
      this.viewStatistics.showInvitation();
    }
  }
}
