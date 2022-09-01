import LocalStorage from '../../services/store';
import { IGameCurrentResult } from '../types/types';

export default class ViewGames {
  drawLevelWindow(component: HTMLElement, LS: LocalStorage) {
    const LSPage = LS.getLS().page;
    const comp = component;
    comp.className = `main_${LSPage} main_games`;

    const main = document.createElement('div');
    main.className = `${LSPage} games`;

    if (LSPage === 'audioGame') {
      main.innerHTML = `<h3 class="games__header">Аудиовызов</h3>
      <h4 class="games__description">В игре аудиовызов вам предстоит выбрать верный перевод слова, которое вы услышите.</h4>
      <h4 class="games__description games_check-lvl">Выберите уровень сложности игры.</h4>`;
    } else {
      main.innerHTML = `<h3 class="games__header">Спринт</h3>
      <h4 class="games__description">В игре спринт вас ожидает игра на скорость.</h4>
      <h4 class="games__description">Поторопитесь! У вас есть всего лишь минута.</h4>
      <h4 class="games__description games_check-lvl">Выберите уровень сложности игры.</h4>`;
    }

    const audioGameLvl = document.createElement('div');
    audioGameLvl.className = 'games__lvls';

    const lvlCount = 6;
    for (let i = 1; i <= lvlCount; i += 1) {
      const elem = document.createElement('button');
      elem.setAttribute('data-lvl', String(i - 1));
      elem.className = `games__lvl-item`;
      elem.innerHTML = String(i);
      audioGameLvl.append(elem);
    }
    main.append(audioGameLvl);
    component.append(main);
    document.body.append(component);
  }

  drawResults(statistic: IGameCurrentResult, component: HTMLElement) {
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

    statisticWrapper.className = 'game-result__statistic-wrapper';
    rightStatistic.className = 'game-result__right';
    wrongStatistic.className = 'game-result__wrong';
    rightWords.className = 'game-result__right-words';
    wrongWords.className = 'game-result__wrong-words';
    main.className = 'game-result__statistic';
    mainPageBtn.className = 'primary-button game-result__main-pg-btn';
    continueBtn.className = 'primary-button game-result__btn-continue';
    btnWrapper.className = 'game-result__btn-wrapper';

    this.addWordsResult(statistic.successWords, rightWords);
    this.addWordsResult(statistic.failWords, wrongWords);
    rightStatistic.innerHTML = `<h4>Знаю</h4>
                                <div class='game-result__right-count'>${statistic.successWords.length}</div>`;
    wrongStatistic.innerHTML = `<h4>Ошибок</h4>
                                <div class='game-result__wring-statistic-count'>${statistic.failWords.length}</div>`;
    continueBtn.innerHTML = 'Еще раз';
    mainPageBtn.innerHTML = 'На главную';

    statisticWrapper.append(main, btnWrapper);
    btnWrapper.append(continueBtn, mainPageBtn);
    main.append(wrongStatistic, wrongWords, rightStatistic, rightWords);
    comp.append(statisticWrapper);
  }

  addWordsResult(array: IGameCurrentResult['successWords'], component: HTMLElement) {
    for (let i = 0; i < array.length; i += 1) {
      const word = document.createElement('div');
      word.className = 'game-result__word';
      word.innerHTML = `<div class='${i} word__img'></div>
                        <p><b class='enWord'>${array[i].enWord}</b> - ${array[i].ruWord}</p>`;
      component.append(word);
    }
    return component;
  }
}
