import { IAttributes, IWord } from '../../types/types';
import { getGamePack } from './generateGamePack';
import { renderSprintGame } from './view';
import startGame from './startGame';

export default class SprintController {
  attributes: IAttributes;

  constructor(attributes: IAttributes) {
    this.attributes = attributes;
  }

  public luanchGame(data: IWord[]): void {
    const gamePack = getGamePack(data);
    renderSprintGame(this.attributes);
    startGame(gamePack);
  }
}
