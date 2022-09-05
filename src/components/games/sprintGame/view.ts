import { createHtmlEl } from '../../authorization/helpers';
import { IAttributes } from '../../types/types';
import * as view from './renderFunctions';

export const updateWords = (enWord: string, ruWord: string, isCorrect: boolean): void => {
  const wordEnElement = document.querySelector('[data-word="en-word"]') as HTMLElement;
  const wordRuElement = document.querySelector('[data-word="ru-word"]') as HTMLElement;
  wordEnElement.innerHTML = enWord;
  wordRuElement.innerHTML = ruWord;
  wordRuElement.setAttribute('data-isCorrect', String(isCorrect));
};

export const renderSprintGame = (attributes: IAttributes): void => {
  const wrapper = attributes.component;
  wrapper.classList.add('main_sprint', 'main_games');
  const container = createHtmlEl('div', 'container');
  const sprint = createHtmlEl('section', 'sprintGame');

  const additionalScore = createHtmlEl('div', 'additionalScore');
  sprint.appendChild(additionalScore);
  sprint.appendChild(view.getProgressBar());
  sprint.appendChild(view.getScore());
  sprint.appendChild(view.getSprinCard());
  container.appendChild(sprint);

  wrapper.innerHTML = '';
  wrapper.appendChild(container);
};
