import { GamePack, GamePackValue } from './generateGamePack';
import { updateWords } from './view';
import '../../../assets/audio/fail.mp3';
import '../../../assets/audio/success.mp3';
import animateCircle from './animateCircle';

type StatisticWord = {
  enWord: string,
  ruWord: string,
  sound: string
}

interface ICurrentResult {
  successWords: StatisticWord[],
  failWords: StatisticWord[],
  rightseries: number
}

class Result {
  successWords: StatisticWord[] = [];

  failWords: StatisticWord[] = [];

  rightseries = 0;

  public updateSuccessWords (word: StatisticWord) {
    this.successWords.push(word)
  }

  public updateFailWords (word: StatisticWord) {
    this.failWords.push(word)
  }

  public updateSeries (value: number) {
    this.rightseries = value
  }

}

const blockButtons = (): void => {
  const buttons = document.querySelectorAll('.sprint__btn');
  buttons.forEach((btn) => btn.setAttribute('disabled', ''));
};

const getWord = (map: GamePack): GamePackValue => {
  const keys = Array.from(map.keys());
  const key = keys.pop() as string;
  const word = map.get(key);
  map.delete(key);
  return word as GamePackValue;
};

const onRight = (comparative: string) => comparative === 'true';
const onWrong = (comparative: string) => comparative === 'false';

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

const updateScore = (): void => {
  const score = document.querySelector('.score__count') as HTMLElement;
  const additionalScore = document.querySelector('.additionalScore') as HTMLElement;
  const quantity = score.dataset.scoreCount as string;
  if (checkCombo()) {
    const newQuantity = String(+quantity + 40);
    additionalScore.innerHTML = '+40';
    setTimeout(() => {
      additionalScore.innerHTML = '';
    }, 1000);
    score.innerHTML = newQuantity;
    score.dataset.scoreCount = newQuantity;
  } else {
    updateCombo();
    const newQuantity = String(+quantity + 20);
    score.innerHTML = newQuantity;
    score.dataset.scoreCount = newQuantity;
  }
};

type CheckWordOption = 'right' | 'wrong';
const checkValueByOption: Record<CheckWordOption, (comparative: string, word: GamePackValue, result: Result) => Promise<string>> = {
  right: (comparator, word, result) => {
    const audio = new Audio();
    if (onRight(comparator)) {
      updateScore();
      result.updateSuccessWords({ enWord: word.word, ruWord: word.correctTranslation, sound: word.sound});
      audio.src = './assets/audio/success.mp3';
      audio.play().catch(() => console.log('err'));
      return Promise.resolve('success');
    }

    clearCombo();
    result.updateFailWords({ enWord: word.word, ruWord: word.correctTranslation, sound: word.sound});
    audio.src = './assets/audio/fail.mp3';
    audio.play().catch(() => console.log('err'));
    return Promise.resolve('fail');
  },
  wrong: (comparator, word, result) => {
    const audio = new Audio();
    if (onWrong(comparator)) {
      updateScore();
      result.updateSuccessWords({ enWord: word.word, ruWord: word.correctTranslation, sound: word.sound});
      audio.src = './assets/audio/success.mp3';
      audio.play().catch(() => console.log('err'));
      return Promise.resolve('success');
    }

    clearCombo();
    result.updateFailWords({ enWord: word.word, ruWord: word.correctTranslation, sound: word.sound});
    audio.src = './assets/audio/fail.mp3';
    audio.play().catch(() => console.log('err'));
    return Promise.resolve('fail');
  },
};

const finishGame = (interval: NodeJS.Timer, 
  animate: Animation, 
  result: Result, 
  series: Record<string, number>
): void => {
  blockButtons();
  clearInterval(interval);
  animate.pause();
  result.updateSeries(series.best);
}

export default (gamePack: GamePack): void => {
  let word = getWord(gamePack);
  updateWords(word.word, word.translation, word.correct);

  const result = new Result();
  const series = {
    current: 0,
    best: 0,
  };

  const animate= animateCircle();
  const progressBar = document.querySelector('.progressbar__text') as HTMLElement;
  let count = +(progressBar.dataset.count as string);
  const progress = setInterval(() => {
    if (count >= 1) {
      count -= 1;
      progressBar.innerHTML = String(count);
    }
  }, 1000);

  const finish = setTimeout(() => {
    finishGame(progress, animate, result, series);
    console.log(result)
  }, 60000);
  

  document.addEventListener('click', (e: Event) => {
    const target = e.target as HTMLElement;
    if (!target.matches('.sprint__btn')) {
      return;
    }


    const wordRuElement = document.querySelector('[data-word="ru-word"]') as HTMLElement;
    const isCorrect = wordRuElement.dataset.iscorrect as string;
    const key = target.innerHTML as CheckWordOption;


    checkValueByOption[key](isCorrect, word, result)
      .then((res) => {
        if (res === 'success') {
          series.current += 1;
        } else if (series.current > series.best) {
          series.best = series.current;
          series.current = 0;
        }
      })
      .catch((err) => console.log(err));

    if (gamePack.size === 0) {
      clearTimeout(finish);
      finishGame(progress, animate, result, series);
      console.log(result)
      return;
    }
    word = getWord(gamePack);
    updateWords(word.word, word.translation, word.correct);
  });
};
