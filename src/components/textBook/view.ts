import './style.scss';
import { IWord } from '../types/types';

export default class ViewTextBook {
  container: HTMLDivElement;

  constructor(container: HTMLDivElement) {
    this.container = container;
  }

  drawCard(word: IWord) {
    const baseUrl = 'https://rslang-learnwords-api.herokuapp.com'; // temporary
    const cardWord = document.createElement('div');
    cardWord.dataset.wordid = word.id;
    cardWord.classList.add('card-word');
    this.container.appendChild(cardWord);

    cardWord.innerHTML = `
      <div class="main-wrapper">
        <img class="word-picture" src="${baseUrl}/${word.image}" alt="${word.word}">
        <div class="card-content">
          <audio src="${baseUrl}/${word.audio}" preload="auto"></audio>
          <audio src="${baseUrl}/${word.audioMeaning}" preload="auto"></audio>
          <audio src="${baseUrl}/${word.audioExample}" preload="auto"></audio>
          <div class="word-container">
            <span class="word-translate"><b>${word.word} - ${word.transcription} - ${word.wordTranslate}</b></span>
          </div>
          <div class="sentense-container">
            <p class="text-meaning">${word.textMeaning}<br>${word.textMeaningTranslate}</p>
            <p class="text-example">${word.textExample}<br>${word.textExampleTranslate}</p>
          </div>
          <button class="sound-btn" title="audio"></button>
        </div>
      </div>
      <div class="user-wrapper">
        <div class="btns-container">
          <button class="btn-hard">Сложное</button>
          <button class="btn-learned">Изучено</button>
        </div>
        <div class="footer-wrapper">
          <div class="right-container">
            <span class="right-symbol">✔</span>
            <span class="right-count">0</span>
          </div>
          <div class="wrong-container">
            <span class="wrong-symbol">✖</span>
            <span class="wrong-count">0</span>
          </div>
        </div>
      </div>`;
  }
}
