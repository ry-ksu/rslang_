import { createHtmlEl } from "../../authorization/helpers";

export const getProgressBar = (): HTMLElement => {
  const progressBar = createHtmlEl('div', 'progressbar');
  progressBar.innerHTML = `
  <svg class="progressbar__svg">
    <circle cx="60" cy="60" r="55" class="progressbar__svg-circle circle-html shadow-html"></circle>
  </svg>
  <span class="progressbar__text shadow-html" data-count="60">60</span>`;
  return progressBar;
}

export const getScore = (): HTMLElement => {
  const score = createHtmlEl('div', 'score');
  score.innerHTML = `
  <span class="score__title">Total score:</span>
  <span class="score__count" data-score-count="0">0</span>`;
  return score;
}

export const getCombo = (): HTMLElement => {
  const combo = createHtmlEl('div', 'combo');
  combo.innerHTML = `
    <div class="combo__item"></div>
    <div class="combo__item"></div>
    <div class="combo__item"></div>`;
  return combo;
}

export const getWordsWrapper = (): HTMLElement => {
  const wordsWrapper = createHtmlEl('div', 'words');
  wordsWrapper.innerHTML = `
    <div class="word" data-word="en-word"></div>
    <div class="word" data-word="ru-word"></div>`
  return wordsWrapper;
}

export const getButtons = (): HTMLElement => {
  const buttonsWrapper = createHtmlEl('div', 'buttons');
  buttonsWrapper.innerHTML = `
    <button type="button" class="sprint__btn btn-danger">wrong</button>
    <button type="button" class="sprint__btn primary-button">right</button>`;
  return buttonsWrapper;
}

export const getSprinCard = (): HTMLElement => {
  const sprintCard = createHtmlEl('div', 'sprint__card');
  sprintCard.appendChild(getCombo());
  sprintCard.appendChild(getWordsWrapper());
  sprintCard.appendChild(getButtons());
  return sprintCard;
}
