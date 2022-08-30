import { IWord, IAttributes } from '../types/types';
import ViewGames from './view';
import ControllerAudioGame from './audioGame/controller';
import SprintController from './sprintGame/controller';

export default class ControllerGames {
  viewGames: ViewGames;

  controllers: {
    controllerAudioGame: ControllerAudioGame;
    controllerSprintGame: SprintController;
  };

  attributes: IAttributes;

  constructor(attributes: IAttributes) {
    this.attributes = attributes;
    this.viewGames = new ViewGames();
    this.controllers = {
      controllerAudioGame: new ControllerAudioGame(this.attributes),
      controllerSprintGame: new SprintController(this.attributes),
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
    // навешиваем событие на нажатие на уровень
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

  // создаем набор объектов для игры
  createGamePack(date: IWord[]) {
    // Сортируем полученный набор слов в случайном порядке
    const randomDate = date.sort(() => Math.random() - 0.5);
    const LSPage = this.attributes.localStorage.getLS().page;

    if (LSPage === 'audioGame') {
      this.controllers.controllerAudioGame.createGamePackForAudioGame(randomDate);
    } else if (LSPage === 'sprint') {
      this.controllers.controllerSprintGame.luanchGame()
    }
  }
}
