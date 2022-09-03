import { IAttributes, IWord } from '../../types/types';
import { getGamePack } from './generateGamePack';
import { renderSprintGame } from './view';
import startGame from './startGame';
import ControllerGames from '../controller';
import ViewGames from '../view';

export default class SprintController {
  attributes: IAttributes;

  viewGames: ViewGames;

  controllerGames: ControllerGames;

  constructor(controllerGames: ControllerGames, viewGames: ViewGames, attributes: IAttributes) {
    this.attributes = attributes;
    this.viewGames = viewGames;
    this.controllerGames = controllerGames;
  }

  public luanchGame(data: IWord[]): void {
    const gamePack = getGamePack(data);
    renderSprintGame(this.attributes);
    startGame(gamePack, this.viewGames, this.attributes.component, this.controllerGames);
  }
}
