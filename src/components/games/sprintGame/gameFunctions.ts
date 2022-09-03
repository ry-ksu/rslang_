import '../../../assets/audio/fail.mp3';
import '../../../assets/audio/success.mp3';

export const blockButtons = (): void => {
  const buttons = document.querySelectorAll('.sprint__btn');
  buttons.forEach((btn) => btn.setAttribute('disabled', ''));
};

export const uBockButtons = (): void => {
  const buttons = document.querySelectorAll('.sprint__btn');
  buttons.forEach((btn) => btn.removeAttribute('disabled'));
};

export const checkOnRight = (comparative: string) => comparative === 'true';
export const checkOnWrong = (comparative: string) => comparative === 'false';

export const clearCombo = (): void => {
  const elements = Array.from(document.querySelectorAll('.combo__item'));
  elements.forEach((el) => (el as HTMLElement).classList.remove('active'));
};

export const checkCombo = (): boolean => {
  const elements = Array.from(document.querySelectorAll('.combo__item'));
  const isCombo = elements.every((el) => (el as HTMLElement).matches('.active'));
  if (isCombo) {
    clearCombo();
  }
  return isCombo;
};

export const updateCombo = (): void => {
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

export type CheckWordOption = 'right' | 'wrong';
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

export const updateScore = (): void => {
  if (checkCombo()) {
    updateScoreByValue(40);
  } else {
    updateCombo();
    updateScoreByValue(20);
  }
};

export const checkValueByOption: Record<CheckWordOption, (comparative: string) => Promise<string>> =
  {
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
