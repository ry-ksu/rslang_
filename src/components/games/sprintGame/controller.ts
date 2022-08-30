import { IAttributes } from "../../types/types";
import { renderSprintGame } from "./view";

export default class SprintController {
  attributes: IAttributes;

  constructor(attributes: IAttributes) {
    this.attributes = attributes;
  }

  public luanchGame(): void {
    renderSprintGame(this.attributes);
  }
}