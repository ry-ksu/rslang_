import { IWord, IAttributes, IGameCurrentResult } from '../types/types';
import ViewGames from './view';
import ControllerAudioGame from './audioGame/controller';
import SprintController from './sprintGame/controller';
import App from '../app';
import ControllerAuthorization from '../authorization/controller';

export default class ControllerGames {
  finishGameStatistic: IGameCurrentResult;

  controllerApp: App;

  viewGames: ViewGames;

  athorization: ControllerAuthorization;

  controllers: {
    controllerAudioGame: ControllerAudioGame;
    controllerSprintGame: SprintController;
  };

  attributes: IAttributes;

  constructor(controllerApp: App, attributes: IAttributes, athorization: ControllerAuthorization) {
    this.finishGameStatistic = {
      newWords: [],
      successWords: [],
      failWords: [],
      currentSeries: 0,
      rightSeries: 0,
    };
    this.controllerApp = controllerApp;
    this.attributes = attributes;
    this.athorization = athorization;
    this.viewGames = new ViewGames();
    this.controllers = {
      controllerAudioGame: new ControllerAudioGame(this, this.viewGames, this.attributes),
      controllerSprintGame: new SprintController(
        this,
        this.viewGames,
        this.attributes,
        this.athorization
      ),
    };
  }

  // проверка, отдали ли нам список слов, или нужно запрашивать его самостоятельно
  getData(gameWords: IWord[] = []) {
    // Если список слов отдали
    if (gameWords.length !== 0) {
      this.createGamePack(gameWords);
    } else {
      // если список слов не отдали (переход через хедер)
      this.viewGames.drawLevelWindow(
        // рисуем окно для выбора уровня
        this.attributes.component,
        this.attributes.localStorage
      );
      this.attachEvents();
    }
  }

  attachEvents() {
    // навешиваем событие при нажатии на уровень
    if (document.querySelector('.games__lvls')) {
      (document.querySelector('.games__lvls') as HTMLElement).addEventListener(
        'click',
        this.checkDataLvlAttribute.bind(this)
      );
    }
  }

  detachEvents() {
    if (document.querySelector('.games__lvls')) {
      (document.querySelector('.games__lvls') as HTMLElement).removeEventListener(
        'click',
        this.checkDataLvlAttribute.bind(this)
      );
    }
  }

  // Проверяем значение уровня и запрашиваем слова с данного уровня (страница рандомная)
  checkDataLvlAttribute(e: Event) {
    if ((e.target as HTMLElement).hasAttribute('data-lvl')) {
      this.detachEvents();
      this.getServerWordsData(Number((e.target as HTMLElement).getAttribute('data-lvl')));
    }
  }

  // Запрашиваем слова у сервера, передавая конкретный уровень.
  getServerWordsData(lvl: number) {
    this.attributes.wordsApi
      .getWords({
        wordGroup: lvl,
        // Страница рандомная
        wordPage: Math.floor(Math.random() * 30),
      })
      // создаем набор объектов для игры из полученных слов
      .then((result: IWord[]) => this.createGamePack(result))
      .catch((err) => console.log(err));
  }

  goToGame() {
    // this.controllerApp.render();
    window.location.reload();
  }

  goToMainPage() {
    this.attributes.localStorage.changeLS('page', 'mainPage');
    this.controllerApp.render();
  }

  playSound(e: Event) {
    if (!(e.target as HTMLElement).classList.contains('word__img')) {
      return;
    }

    const audio = document.createElement('audio');
    const index = Number((e.target as HTMLElement).classList[0]);
    const group = (
      ((e.target as HTMLElement).parentElement as HTMLElement).parentElement as HTMLElement
    ).className;
    if (group === 'game-result__wrong-words') {
      audio.innerHTML = `<source src='${this.attributes.baseURL}/${this.finishGameStatistic.failWords[index].sound}'>`;
    } else {
      audio.innerHTML = `<source src='${this.attributes.baseURL}/${this.finishGameStatistic.successWords[index].sound}'>`;
    }
    audio.setAttribute('autoplay', '');

    if (document.querySelector('audio')) {
      (document.querySelector('audio') as HTMLMediaElement).remove();
    }
    document.body.append(audio);
  }

  attachStatisticEvents(finishGameStatistic: IGameCurrentResult) {
    this.finishGameStatistic = finishGameStatistic;

    (document.querySelector('.game-result__statistic') as HTMLElement).addEventListener(
      'click',
      this.playSound.bind(this)
    );
    (document.querySelector('.game-result__main-pg-btn') as HTMLElement).addEventListener(
      'click',
      this.goToMainPage.bind(this)
    );
    (document.querySelector('.game-result__btn-continue') as HTMLElement).addEventListener(
      'click',
      this.goToGame.bind(this)
    );
  }

  // создаем набор объектов для игры
  createGamePack(date: IWord[]) {
    // Сортируем полученный набор слов в случайном порядке
    const randomDate = date.sort(() => Math.random() - 0.5);
    const LSPage = this.attributes.localStorage.getLS().page;

    if (LSPage === 'audioGame') {
      this.controllers.controllerAudioGame.createGamePackForAudioGame(randomDate);
    } else if (LSPage === 'sprint') {
      this.controllers.controllerSprintGame.luanchGame(randomDate).catch(() => {
        throw new Error();
      });
    }
  }
}
