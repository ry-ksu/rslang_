import { createHtmlEl } from "../../authorization/helpers";
import { IAttributes } from "../../types/types";
import { getProgressBar, getScore, getSprinCard } from "./renderFunctions";
import animateCircle from "./animateCircle";

export const updateWords = (enWord: string, ruWord: string): void => {
  const wordEnElement = document.querySelector('[data-word="en-word"]') as HTMLElement;
  const wordRuElement = document.querySelector('[data-word="ru-word"]') as HTMLElement;
  wordEnElement.innerHTML = enWord;
  wordRuElement.innerHTML = ruWord;
}


export const renderSprintGame = (attributes: IAttributes): void => {
  const wrapper = attributes.component;
  const container = createHtmlEl('div', 'container');
  const sprint = createHtmlEl('section', 'sprintGame');

  sprint.appendChild(getProgressBar());
  sprint.appendChild(getScore());
  sprint.appendChild(getSprinCard());
  container.appendChild(sprint);
  
  wrapper.innerHTML = '';
  wrapper.appendChild(container);
  animateCircle();
  updateWords('customer', 'клиент')
}
