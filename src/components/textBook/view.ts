import './style.scss';
import { IWord } from '../types/types';

export default class ViewTextBook {
  container: HTMLDivElement;

  textBookContainer: HTMLDivElement;

  headerContainer: HTMLDivElement;

  pageContainer: HTMLDivElement;

  paginationContainer: HTMLDivElement;

  baseURL: string;

  constructor(container: HTMLDivElement) {
    this.container = container;
    this.baseURL = 'https://rslang-learnwords-api.herokuapp.com';
    this.textBookContainer = document.createElement('div');
    this.textBookContainer.classList.add('textbook-container');
    this.headerContainer = document.createElement('div');
    this.headerContainer.classList.add('tb-header');
    this.pageContainer = document.createElement('div');
    this.pageContainer.classList.add('tb-page');
    this.paginationContainer = document.createElement('div');
    this.paginationContainer.classList.add('tb-pagination');
    this.textBookContainer.append(this.headerContainer, this.pageContainer, this.paginationContainer);
    this.container.append(this.textBookContainer);
  }

  draw({words, pageNumber, maxPageNumber}: {words: IWord[], pageNumber: number, maxPageNumber: number}) {
    this.drawHeader();
    this.drawPage(words);
    this.drawPagination({pageNumber, maxPageNumber});
  }

  drawHeader() {
    const tbGroupBtns = document.createElement('div');
    tbGroupBtns.classList.add('tb-group-btns');
    const btnsCount = 6;
    for(let i = 0; i < btnsCount; i += 1) {
      const btn = document.createElement('button');
      btn.dataset.tbgroup = `${i}`;
      btn.classList.add('tb-group-btn');
      btn.innerText = `Группа ${i + 1}`
      tbGroupBtns.appendChild(btn);
    }
    const btnHardGroup = document.createElement('button');
    btnHardGroup.classList.add('tb-group-hardbtn');
    btnHardGroup.innerText = `Сложные`;
    tbGroupBtns.appendChild(btnHardGroup);

    const btnGames = document.createElement('div');
    btnGames.classList.add('tb-games-btns');
    const btnSprintGame = document.createElement('button');
    btnSprintGame.classList.add('tb-sprintgame-btn');
    btnSprintGame.innerText = `🏃Спринт`;
    const btnAudioGame = document.createElement('button');
    btnAudioGame.classList.add('tb-audiogame-btn');
    btnAudioGame.innerText = `🎧Аудиовызов`;
    btnGames.append(btnSprintGame, btnAudioGame);
    this.headerContainer.append(tbGroupBtns, btnGames);
  }

  drawPage(words: IWord[]) {
    this.pageContainer.innerHTML = '';
    words.forEach((word) => {
      this.pageContainer.appendChild(this.getCard(word));
    })
  }

  getCard(word: IWord): HTMLDivElement {
    const cardWord = document.createElement('div');
    cardWord.dataset.tbwordid = word.id;
    cardWord.classList.add('tb-card-word');

    cardWord.innerHTML = `
      <div class="main-wrapper">
        <img class="word-picture" src="${this.baseURL}/${word.image}" alt="${word.word}">
        <div class="card-content">
          <audio src="${this.baseURL}/${word.audio}" preload="auto"></audio>
          <audio src="${this.baseURL}/${word.audioMeaning}" preload="auto"></audio>
          <audio src="${this.baseURL}/${word.audioExample}" preload="auto"></audio>
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
    
    return cardWord;
  }

  drawPagination({pageNumber, maxPageNumber}: {pageNumber: number, maxPageNumber: number}) {
    this.paginationContainer.innerHTML = '';
    const btnLeftPage = document.createElement('button');
    btnLeftPage.classList.add('tb-leftpage-btn');
    const pageNumberText = document.createElement('span');
    pageNumberText.innerText = `${pageNumber} / ${maxPageNumber}`;
    const btnRightPage = document.createElement('button');
    btnRightPage.classList.add('tb-rightpage-btn');
    this.paginationContainer.append(btnLeftPage, pageNumberText, btnRightPage);
  }
}
