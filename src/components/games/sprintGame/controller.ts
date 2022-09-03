import { IAttributes, IWord } from '../../types/types';
import { renderSprintGame, updateWords } from './view';
import ControllerGames from '../controller';
import ViewGames from '../view';
import { GamePack, GamePackValue, getGamePack } from './generateGamePack';
import SprintStatistic from './sprintStatistic';
import animateCircle from './animateCircle';
import { blockButtons, checkValueByOption, CheckWordOption, uBockButtons } from './startGame';
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
    this.index += 1;
  }

  public endGame(animate: Animation, interval: NodeJS.Timer, timer?: NodeJS.Timeout) {
    if (this.gamepack.has(this.index)) {
      return;
    }
    blockButtons();
    if (timer) {
      clearTimeout(timer);
    }
    animate.pause();
    clearInterval(interval);
    this.viewGames.drawResults(this.gameStatistic, this.attributes.component);
    setTimeout(() => this.controllerGames.attachStatisticEvents(this.gameStatistic), 200);
    ;
  }

  public luanchGame(data: IWord[]): void {
    this.index = 0;
    this.gamepack = getGamePack(data)
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
      this.endGame(
        animate,
        interval,
        timer
      );
    }, 60000);

    document.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLElement;
      if (!target.matches('.sprint__btn')) {
        return;
      }
      this.updateGame(target, animate, interval, timer);
    });
  }

  public updateGame(
    target: HTMLElement, 
    animate: Animation, 
    interval: NodeJS.Timer, 
    timer?: NodeJS.Timeout
  ) {
    const sprintGame = document.querySelector('.sprintGame') as HTMLElement;
    const wordRuElement = document.querySelector('[data-word="ru-word"]') as HTMLElement;
    const isCorrect = wordRuElement.dataset.iscorrect as string;
    const key = target.innerHTML as CheckWordOption;

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
          blockButtons();
          animateCSS(sprintGame, 'headShake')
            .then(() => uBockButtons())
            .catch((err) => console.log(err));
          this.gameStatistic.updateFailWords({
            enWord: this.word.word,
            ruWord: this.word.correctTranslation,
            sound: this.word.sound,
          });
          this.gameStatistic.updateBestSeries();
        }
      })
      .catch((err) => console.log(err));

    this.endGame(animate, interval, timer)

    if (this.gamepack.has(this.index)) { 
      this.updateWord();
      updateWords(this.word.word, this.word.translation, this.word.correct);
    }
  }
}
