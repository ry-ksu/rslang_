import { IGamePack, IAttributes, IAudioGameCurrentResult } from '../../types/types';

export default class ViewAudioGame {

  draw(gamePack: IGamePack, attributes: IAttributes) {
    const main = attributes.component;
    const currentGamePack: IGamePack = gamePack;
    const allWords = document.createElement('div');
    const skipBtn = document.createElement('button');

    allWords.className = 'audioGame__words';
    skipBtn.className = 'primary-button audioGame__skipBtn'
    main.innerHTML = `<div class="audioGame">
                        <div class="audioGame__img"></div>
                        <h3 class="audioGame__answer"></h3>
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
    (main.querySelector('.audioGame__answer') as HTMLElement).after(allWords);
    (main.querySelector('.audioGame') as HTMLElement).append(skipBtn);
    document.body.append(main);
  }

  drawResults(statistic: IAudioGameCurrentResult, component: HTMLElement) {
    const comp = component;
    comp.innerHTML = '';

    const statisticWrapper = document.createElement('div');
    const main = document.createElement('div');
    const rightWords = document.createElement('div');
    const wrongWords = document.createElement('div');
    const rightStatistic = document.createElement('div');
    const wrongStatistic = document.createElement('div');
    const btnWrapper = document.createElement('div');
    const mainPageBtn = document.createElement('button');
    const continueBtn = document.createElement('button');

    statisticWrapper.className = 'audioGame__statistic-wrapper';
    rightStatistic.className = 'audioGame__right-statistic';
    wrongStatistic.className = 'audioGame__wrong-statistic';
    rightWords.className = 'audioGame__rightWords';
    wrongWords.className = 'audioGame__wrongWords';
    main.className = 'audioGame__statistic';
    mainPageBtn.className = 'primary-button audioGame__mainPgBtn';
    continueBtn.className = 'primary-button audioGame__btn-continue';
    btnWrapper.className = 'audioGame__btn-wrapper'

    this.addWordsResult(statistic.successWords, rightWords);
    this.addWordsResult(statistic.failWords, wrongWords);
    rightStatistic.innerHTML = `<h4>Знаю</h4>
                                <div class='audioGame__right-statistic-count'>${statistic.successWords.length}</div>`
    wrongStatistic.innerHTML = `<h4>Ошибок</h4>
                                <div class='audioGame__wring-statistic-count'>${statistic.failWords.length}</div>`
    continueBtn.innerHTML = 'Еще раз';
    mainPageBtn.innerHTML = 'На главную';

    statisticWrapper.append(main, btnWrapper);
    btnWrapper.append(continueBtn, mainPageBtn);
    main.append(wrongStatistic, wrongWords, rightStatistic, rightWords);
    comp.append(statisticWrapper);
  }

  addWordsResult(array: IAudioGameCurrentResult['successWords'], component: HTMLElement) {
    for (let i = 0; i < array.length; i += 1) {
      const word = document.createElement('div');
      word.className = 'audioGame__word';
      word.innerHTML = `<div class='${i} word__img'></div>
                        <p><b class='enWord'>${array[i].enWord}</b> - ${array[i].ruWord}</p>`
      component.append(word);
    }
    return component;
  }
}
