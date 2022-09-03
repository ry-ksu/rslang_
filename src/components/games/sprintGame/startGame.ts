import { GamePack, GamePackValue } from './generateGamePack';
import { updateWords } from './view';
import '../../../assets/audio/fail.mp3';
import '../../../assets/audio/success.mp3';
import animateCircle from './animateCircle';
import ViewGames from '../view';
import SprintStatistic from './sprintStatistic';
import animateCSS from '../../authorization/animate';
import ControllerGames from '../controller';

const blockButtons = (): void => {
  const buttons = document.querySelectorAll('.sprint__btn');
  buttons.forEach((btn) => btn.setAttribute('disabled', ''));
};

const uBockButtons = (): void => {
  const buttons = document.querySelectorAll('.sprint__btn');
  buttons.forEach((btn) => btn.removeAttribute('disabled'));
};

const getWord = (map: GamePack): GamePackValue => {
  const keys = Array.from(map.keys());
  const key = keys.pop() as string;
  const word = map.get(key);
  map.delete(key);
  return word as GamePackValue;
};

const checkOnRight = (comparative: string) => comparative === 'true';
const checkOnWrong = (comparative: string) => comparative === 'false';

const clearCombo = (): void => {
  const elements = Array.from(document.querySelectorAll('.combo__item'));
  elements.forEach((el) => (el as HTMLElement).classList.remove('active'));
};

const checkCombo = (): boolean => {
  const elements = Array.from(document.querySelectorAll('.combo__item'));
  const isCombo = elements.every((el) => (el as HTMLElement).matches('.active'));
  if (isCombo) {
    clearCombo();
  }
  return isCombo;
};

const updateCombo = (): void => {
  const first = document.querySelector('[data-series="1"]') as HTMLElement;
  const second = document.querySelector('[data-series="2"]') as HTMLElement;
  const third = document.querySelector('[data-series="3"]') as HTMLElement;

  if (!first.classList.contains('active')) {
    first.classList.add('active');
  } else if (!second.classList.contains('active')) {
    second.classList.add('active');
  } else {
    third.classList.add('active');
  }
};

const updateScoreByValue = (points: number): void => {
  const score = document.querySelector('.score__count') as HTMLElement;
  const additionalScore = document.querySelector('.additionalScore') as HTMLElement;
  const quantity = score.dataset.scoreCount as string;
  const newQuantity = String(+quantity + points);
  additionalScore.innerHTML = `+${points}`;
  setTimeout(() => {
    additionalScore.innerHTML = '';
  }, 1000);
  score.innerHTML = newQuantity;
  score.dataset.scoreCount = newQuantity;
};

const updateScore = (): void => {
  if (checkCombo()) {
    updateScoreByValue(40);
  } else {
    updateCombo();
    updateScoreByValue(20);
  }
};

type CheckWordOption = 'right' | 'wrong';

const checkValueByOption: Record<CheckWordOption, (comparative: string) => Promise<string>> = {
  right: (comparator) => {
    const audio = new Audio();
    if (checkOnRight(comparator)) {
      updateScore();
      audio.src = './assets/audio/success.mp3';
      audio.play().catch(() => console.log('err'));
      return Promise.resolve('success');
    }

    clearCombo();
    audio.src = './assets/audio/fail.mp3';
    audio.play().catch(() => console.log('err'));
    return Promise.resolve('fail');
  },
  wrong: (comparator) => {
    const audio = new Audio();
    if (checkOnWrong(comparator)) {
      updateScore();
      audio.src = './assets/audio/success.mp3';
      audio.play().catch(() => console.log('err'));
      return Promise.resolve('success');
    }

    clearCombo();
    audio.src = './assets/audio/fail.mp3';
    audio.play().catch(() => console.log('err'));
    return Promise.resolve('fail');
  },
};

const finishGame = (
  interval: NodeJS.Timer,
  animate: Animation,
  gameStatistic: SprintStatistic,
  viewGames: ViewGames,
  component: HTMLElement,
  controllerGames: ControllerGames
): void => {
  blockButtons();
  clearInterval(interval);
  animate.pause();
  viewGames.drawResults(gameStatistic, component);
  controllerGames.attachStatisticEvents(gameStatistic);
};

export default (
  gamePack: GamePack,
  viewGames: ViewGames,
  component: HTMLElement,
  controllerGames: ControllerGames
): void => {
  let word = getWord(gamePack);
  updateWords(word.word, word.translation, word.correct);

  const gameStatistic = new SprintStatistic();

  const animate = animateCircle();
  const progressBar = document.querySelector('.progressbar__text') as HTMLElement;
  const sprintGame = document.querySelector('.sprintGame') as HTMLElement;

  let count = +(progressBar.dataset.count as string);
  const progress = setInterval(() => {
    if (count >= 1) {
      count -= 1;
      progressBar.innerHTML = String(count);
    }
  }, 1000);

  const finish = setTimeout(() => {
    finishGame(progress, animate, gameStatistic, viewGames, component, controllerGames);
  }, 60000);
  document.addEventListener('click', (e: Event) => {
    const target = e.target as HTMLElement;
    if (!target.matches('.sprint__btn')) {
      return;
    }

    const wordRuElement = document.querySelector('[data-word="ru-word"]') as HTMLElement;
    const isCorrect = wordRuElement.dataset.iscorrect as string;
    const key = target.innerHTML as CheckWordOption;

    checkValueByOption[key](isCorrect)
      .then((res) => {
        if (res === 'success') {
          gameStatistic.updateSuccessWords({
            enWord: word.word,
            ruWord: word.correctTranslation,
            sound: word.sound,
          });
          gameStatistic.updateNewWords(word.word);
          gameStatistic.updateSeries();
        } else {
          blockButtons();
          animateCSS(sprintGame, 'headShake')
            .then(() => uBockButtons())
            .catch((err) => console.log(err));
          gameStatistic.updateFailWords({
            enWord: word.word,
            ruWord: word.correctTranslation,
            sound: word.sound,
          });
          gameStatistic.updateBestSeries();
        }
      })
      .catch((err) => console.log(err));

    if (gamePack.size === 0) {
      clearTimeout(finish);
      setTimeout(
        () => finishGame(progress, animate, gameStatistic, viewGames, component, controllerGames),
        100
      );
      return;
    }
    word = getWord(gamePack);
    updateWords(word.word, word.translation, word.correct);
  });
};
