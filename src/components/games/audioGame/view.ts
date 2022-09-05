import { IGamePack, IAttributes } from '../../types/types';

export default class ViewAudioGame {
  draw(gamePack: IGamePack, attributes: IAttributes) {
    (document.querySelector('main') as HTMLElement).className = 'main_audioGame main_games';

    if (document.querySelector('footer')) {
      (document.querySelector('footer') as HTMLElement).remove();
    }

    const main = attributes.component;
    const currentGamePack: IGamePack = gamePack;
    const allWords = document.createElement('div');
    const skipBtn = document.createElement('button');

    allWords.className = 'audioGame__words';
    skipBtn.className = 'primary-button audioGame__skipBtn';
    main.innerHTML = `<div class="audioGame">
                        <div class="audioGame__img"></div>
                        <h3 class="audioGame__answer"></h3>
                      </div>`;
    skipBtn.innerHTML = '(Пробел) Я не знаю';

    for (let i = 0; i < currentGamePack.ruMixWords.length; i += 1) {
      const elem = document.createElement('p');

      if (currentGamePack.ruMixWords[i] === currentGamePack.ruRightWord) {
        elem.className = `additional-button right word_${i}`;
      } else {
        elem.className = `additional-button wrong word_${i}`;
      }

      elem.innerHTML = `(${i + 1}) ${currentGamePack.ruMixWords[i]}`;
      allWords.append(elem);
    }
    (main.querySelector('.audioGame__answer') as HTMLElement).after(allWords);
    (main.querySelector('.audioGame') as HTMLElement).append(skipBtn);
    document.body.append(main);
  }
}
