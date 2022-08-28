import { IGamePack, IAttributes, IUserStatistics } from '../types/types';

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

  drawLevelWindow(component: HTMLElement) {
    const main = document.createElement('div');
    main.className = 'audioGame';
    main.innerHTML =
      '<h3 class="audioGame__header">Аудиовызов</h3>' +
      '<h4>В игре аудиовызов вам предстоит выбрать верный перевод слова, которое вы услышите.</h4>' +
      '<h4 class="audioGame__description">Выберите уровень сложности игры.</h4>';

    const audioGameLvl = document.createElement('div');
    audioGameLvl.className = 'audioGame__lvls';

    const lvlCount = 6;
    for (let i = 1; i <= lvlCount; i += 1) {
      const elem = document.createElement('button');
      elem.setAttribute('data-lvl', String(i));
      elem.className = 'audioGame__lvl-item';
      elem.innerHTML = String(i);
      audioGameLvl.append(elem);
    }
    main.append(audioGameLvl);
    component.append(main);
    document.body.append(component);
  }

  draw(gamePack: IGamePack, attributes: IAttributes) {
    const main = attributes.component;
    const currentGamePack = gamePack;
    const allWords = document.createElement('div');

    allWords.className = 'audioGame__words';

    main.innerHTML = '<div class="audioGame"><div class="audioGame__img"></div></div>';

    for (let i = 0; i < currentGamePack.mixWords.length; i += 1) {
      const elem = document.createElement('div');

      if (currentGamePack.mixWords[i] === currentGamePack.rightWord) {
        elem.className = 'right';
      } else {
        elem.className = 'wrong';
      }

      elem.innerHTML = currentGamePack.mixWords[i];
      allWords.append(elem);
    }
    (main.querySelector('.audioGame__img') as HTMLElement).after(allWords);
    document.body.append(main);
  }
}
