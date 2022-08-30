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
    const skipBtn = document.createElement('button');

    // main.className = '';
    allWords.className = 'audioGame__words';
    skipBtn.className = 'primary-button audioGame__skipBtn'
    main.innerHTML = `<div class="audioGame">
                        <div class="audioGame__img"></div>
                      </div>`;
    skipBtn.innerHTML = 'Я не знаю';

    for (let i = 0; i < currentGamePack.ruMixWords.length; i += 1) {
      const elem = document.createElement('p');

      if (currentGamePack.ruMixWords[i] === currentGamePack.ruRightWord) {
        elem.className = `additional-button right word_${i}`;
      } else {
        elem.className = `additional-button wrong word_${i}`;
      }

      elem.innerHTML = `${i + 1} ${currentGamePack.ruMixWords[i]}`;
      allWords.append(elem);
    }
    (main.querySelector('.audioGame__img') as HTMLElement).after(allWords);
    (main.querySelector('.audioGame') as HTMLElement).append(skipBtn);
    document.body.append(main);
  }
}
