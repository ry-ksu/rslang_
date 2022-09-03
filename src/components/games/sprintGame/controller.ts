import { IAttributes, IWord } from '../../types/types';
import { renderSprintGame, updateWords } from './view';
import ControllerGames from '../controller';
import ViewGames from '../view';
import { GamePack, GamePackValue, getGamePack } from './generateGamePack';
import SprintStatistic from './sprintStatistic';
import animateCircle from './animateCircle';
import { blockButtons, checkValueByOption, CheckWordOption, uBockButtons } from './gameFunctions';
import animateCSS from '../../authorization/animate';

export default class SprintController {
  attributes: IAttributes;

  viewGames: ViewGames;

  controllerGames: ControllerGames;

  gamepack: GamePack;

  gameStatistic: SprintStatistic

  index = 0;

  word: GamePackValue;

  finish = false;

  constructor(controllerGames: ControllerGames, viewGames: ViewGames, attributes: IAttributes) {
    this.attributes = attributes;
    this.viewGames = viewGames;
    this.controllerGames = controllerGames;
    this.gamepack = new Map();
    this.gameStatistic = new SprintStatistic();
    this.word = {
      word: '',
      translation: '',
      correct: false,
      sound: '',
      correctTranslation: ''
    };
  }

  public updateWord() {
    const word = this.gamepack.get(this.index) as GamePackValue;
    this.word = word;
  }

  public luanchGame(data: IWord[]): void {
    this.index = 0;
    this.gameStatistic.cleanStatistic();

    this.gamepack = getGamePack(data)
    this.updateWord();
    renderSprintGame(this.attributes);
    updateWords(this.word.word, this.word.translation, this.word.correct);
    console.log(this.gamepack)
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
      this.endGame(
        animate,
        interval,
        timer
      );
    }, 60000);

    (document.querySelector('.sprintGame ') as HTMLElement).addEventListener('click', (e: Event) => {
      const target = e.target as HTMLElement;
      if (!target.matches('.sprint__btn')) {
        return;
      }
      this.updateGame(e, animate, interval, timer);
    });

    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') {
        return;
      }
      this.updateGame(e, animate, interval, timer)
    });
  }

  public updateGame(
    e:  Event | KeyboardEvent,
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

    checkValueByOption[key](isCorrect)
      .then((res) => {
        if (res === 'success') {
          this.gameStatistic.updateSuccessWords({
            enWord: this.word.word,
            ruWord: this.word.correctTranslation,
            sound: this.word.sound,
          });
          this.gameStatistic.updateNewWords(this.word.word);
          this.gameStatistic.updateSeries();
        } else {
          animateCSS(sprintGame, 'headShake')
            .catch((err) => console.log(err));
          this.gameStatistic.updateFailWords({
            enWord: this.word.word,
            ruWord: this.word.correctTranslation,
            sound: this.word.sound,
          });
          this.gameStatistic.updateBestSeries();
        }
        if (this.gamepack.has(this.index)) { 
          this.updateWord();
          updateWords(this.word.word, this.word.translation, this.word.correct);
          this.index += 1;
        } else {
          this.endGame(animate, interval, timer);
        }
      })
      .catch((err) => console.log(err));
  }
 
  public endGame(animate: Animation, interval: NodeJS.Timer, timer?: NodeJS.Timeout) {
    blockButtons();
    if (timer) {
      clearTimeout(timer);
    }
    animate.pause();
    clearInterval(interval);
    setTimeout(() => {
      this.viewGames.drawResults(this.gameStatistic, this.attributes.component)
      this.controllerGames.attachStatisticEvents(this.gameStatistic);
    }, 200);
    clearInterval(interval);
  }
}
