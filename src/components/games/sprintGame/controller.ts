import { IAttributes, ILocalStorage, IUserWord, IWord } from '../../types/types';
import { renderSprintGame, updateWords } from './view';
import ControllerGames from '../controller';
import ViewGames from '../view';
import { GamePack, GamePackValue, getGamePack } from './generateGamePack';
import SprintStatistic from './sprintStatistic';
import animateCircle from './animateCircle';
import { blockButtons, checkValueByOption, CheckWordOption } from './gameFunctions';
import animateCSS from '../../authorization/animate';
import ControllerAuthorization from '../../authorization/controller';
import updateUserWord from '../userWordActions';
import { ComparatorToUpdateUserWord } from '../contracts';
import sendResult from '../gameResult';

export default class SprintController {
  attributes: IAttributes;

  viewGames: ViewGames;

  controllerGames: ControllerGames;

  athorization: ControllerAuthorization;

  gamepack: GamePack;

  gameStatistic: SprintStatistic;

  LS: ILocalStorage;

  userWords: IUserWord[] = [];

  index = 0;

  word: GamePackValue;

  finish = false;

  isAuth = false;

  originalData: IWord[] = [];

  constructor(
    controllerGames: ControllerGames,
    viewGames: ViewGames,
    attributes: IAttributes,
    athorization: ControllerAuthorization
  ) {
    this.attributes = attributes;
    this.viewGames = viewGames;
    this.controllerGames = controllerGames;
    this.athorization = athorization;
    this.gamepack = new Map();
    this.gameStatistic = new SprintStatistic();
    this.word = {
      word: '',
      translation: '',
      correct: false,
      sound: '',
      correctTranslation: '',
      id: '',
    };
    this.LS = attributes.localStorage.getLS();
  }

  public updateWord() {
    this.word = this.gamepack.get(this.index) as GamePackValue;
    this.index += 1;
  }

  public async luanchGame(data: IWord[]): Promise<void> {
    try {
      await this.athorization.checkAuth();
      this.originalData = data;
      this.userWords = await this.attributes.wordsApi.getUserWords({
        userID: this.LS.userId,
        token: this.LS.token,
      });
      this.isAuth = true;
    } catch {
      this.isAuth = false;
    }

    this.index = 0;
    this.gameStatistic.cleanStatistic();
    this.gamepack = getGamePack(data);
    this.updateWord();

    renderSprintGame(this.attributes);
    updateWords(this.word.word, this.word.translation, this.word.correct);
    const animate = animateCircle();
    const progressBar = document.querySelector('.progressbar__text') as HTMLElement;

    let count = +(progressBar.dataset.count as string);
    const interval = setInterval(() => {
      if (count >= 1) {
        count -= 1;
        progressBar.innerHTML = String(count);
      }
    }, 1000);

    const timer = setTimeout(() => {
      this.endGame(animate, interval, timer);
    }, 60000);

    (document.querySelector('.sprintGame ') as HTMLElement).addEventListener(
      'click',
      (e: Event) => {
        const target = e.target as HTMLElement;
        if (!target.matches('.sprint__btn')) {
          return;
        }
        this.updateGame(e, animate, interval, timer).catch(() => {
          console.log();
        });
      }
    );

    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') {
        return;
      }
      this.updateGame(e, animate, interval, timer).catch(() => {
        console.log();
      });
    });
  }

  public async updateGame(
    e: Event | KeyboardEvent,
    animate: Animation,
    interval: NodeJS.Timer,
    timer?: NodeJS.Timeout
  ) {
    const sprintGame = document.querySelector('.sprintGame') as HTMLElement;
    const wordRuElement = document.querySelector<HTMLElement>('[data-word="ru-word"]');
    const isCorrect = wordRuElement?.dataset.iscorrect ?? '';
    if (isCorrect === '') {
      return;
    }

    let key: CheckWordOption;
    if (e instanceof KeyboardEvent) {
      if (e.key === 'ArrowRight') {
        key = 'right';
      } else {
        key = 'wrong';
      }
    } else {
      const target = e.target as HTMLElement;
      key = target.innerHTML as CheckWordOption;
    }

    let comparator: ComparatorToUpdateUserWord;

    const response = await checkValueByOption[key](isCorrect);

    if (response === 'success') {
      comparator = 'success' as ComparatorToUpdateUserWord;

      this.gameStatistic.updateSuccessWords({
        enWord: this.word.word,
        ruWord: this.word.correctTranslation,
        sound: this.word.sound,
        id: this.word.id,
      });
      this.gameStatistic.updateNewWords(this.word.word);
      this.gameStatistic.updateSeries();
    } else {
      comparator = 'failure' as ComparatorToUpdateUserWord;
      animateCSS(sprintGame, 'headShake').catch(() => console.log());
      this.gameStatistic.updateFailWords({
        enWord: this.word.word,
        ruWord: this.word.correctTranslation,
        sound: this.word.sound,
        id: this.word.id,
      });
      this.gameStatistic.updateBestSeries();
    }

    if (this.isAuth) {
      updateUserWord(
        this.userWords,
        this.LS.userId,
        this.word.id,
        this.LS.token,
        this.attributes.wordsApi,
        comparator
      ).catch(() => {
        console.log();
      });
    }
    this.updateWord();

    if (this.word) {
      updateWords(this.word.word, this.word.translation, this.word.correct);
    } else {
      this.endGame(animate, interval, timer);
    }
  }

  public endGame(animate: Animation, interval: NodeJS.Timer, timer?: NodeJS.Timeout) {
    blockButtons();
    if (timer) {
      clearTimeout(timer);
    }
    animate.pause();
    clearInterval(interval);
    setTimeout(() => {
      this.viewGames.drawResults(this.gameStatistic, this.attributes.component);
      this.controllerGames.attachStatisticEvents(this.gameStatistic);
      sendResult(
        this.gameStatistic,
        this.attributes.wordsApi,
        this.LS,
        this.athorization,
        'sprint',
        this.userWords
      ).catch(() => {
        throw new Error();
      });
    }, 200);
    clearInterval(interval);
  }
}
