import { IGamePack, IAttributes, IUserStatistics } from '../../types/types';

export default class ViewAudioGame {
  audioGame: IUserStatistics['optional']['todayStatistics']['audioGame'];

  constructor() {
    this.audioGame = {
      newWords: 0,
      successWords: 0,
      failWords: 0,
      rightSeries: 0,
    };
  }

  draw(gamePack: IGamePack, attributes: IAttributes) {
    const main = attributes.component;
    const currentGamePack: IGamePack = gamePack;
    const allWords = document.createElement('div');

    allWords.className = 'audioGame__words';
    main.innerHTML = '<div class="audioGame"><div class="audioGame__img"></div></div>';

    for (let i = 0; i < currentGamePack.ruMixWords.length; i += 1) {
      const elem = document.createElement('div');

      if (currentGamePack.ruMixWords[i] === currentGamePack.ruRightWord) {
        elem.className = 'right';
      } else {
        elem.className = 'wrong';
      }

      elem.innerHTML = currentGamePack.ruMixWords[i];
      allWords.append(elem);
    }
    (main.querySelector('.audioGame__img') as HTMLElement).after(allWords);
    document.body.append(main);
  }
}