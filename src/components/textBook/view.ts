import { IWord } from '../types/types';
import ControllerTextBook from './controller';

export default class ViewTextBook {
  private controllerTextBook: ControllerTextBook;

  private component: HTMLElement;

  private textBookContainer: HTMLDivElement;

  private headerContainer: HTMLDivElement;

  private pageContainer: HTMLDivElement;

  private paginationContainer: HTMLDivElement;

  private baseURL: string;

  private colors: {
    [key: string]: string;
  };

  constructor({
    controller,
    component,
  }: {
    controller: ControllerTextBook;
    component: HTMLElement;
  }) {
    this.controllerTextBook = controller;
    this.component = component;
    this.baseURL = 'https://rslang-learnwords-api.herokuapp.com';
    this.textBookContainer = document.createElement('div');
    this.textBookContainer.classList.add('textbook-container');
    this.headerContainer = document.createElement('div');
    this.headerContainer.classList.add('tb-header');
    this.pageContainer = document.createElement('div');
    this.pageContainer.classList.add('tb-page');
    this.paginationContainer = document.createElement('div');
    this.paginationContainer.classList.add('tb-pagination');
    this.textBookContainer.append(
      this.headerContainer,
      this.pageContainer,
      this.paginationContainer
    );
    this.component.append(this.textBookContainer);
    this.colors = {
      0: '#b7eee0',
      1: '#eee1b7',
      2: '#b7eeb7',
      3: '#cab7ee',
      4: '#b7e3ee',
      5: '#f2f7d5',
      6: '#e2a6a6',
    };
  }

  draw({
    words,
    wordGroup,
    wordPage,
    maxWordPage,
  }: {
    words: IWord[];
    wordGroup: number;
    wordPage: number;
    maxWordPage: number;
  }) {
    this.drawHeader({ wordGroup });
    this.drawPage(words);
    this.drawPagination({ wordPage, maxWordPage });
    document.body.appendChild(this.component);
  }

  drawHeader({ wordGroup }: { wordGroup: number }) {
    this.headerContainer.innerHTML = '';
    const tbGroupBtns = this.getHeaderBtns({ wordGroup });
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

  private getHeaderBtns({ wordGroup }: { wordGroup: number}): HTMLDivElement {
    const tbGroupBtns = document.createElement('div');
    tbGroupBtns.classList.add('tb-group-btns');
    const btnsCount = 7;
    for (let i = 0; i < btnsCount; i += 1) {
      const btn = document.createElement('button');
      btn.dataset.tbgroup = `${i}`;
      btn.classList.add('tb-group-btn', 'group-btn');
      btn.innerText = `Группа ${i + 1}`;
      btn.style.backgroundColor = this.colors[`${i}`];
      btn.addEventListener('click', () => {
        this.component
          .querySelectorAll('.group-btn')
          .forEach((item) => item.classList.remove('pressed'));
        btn.classList.add('pressed');
        this.textBookContainer.style.backgroundColor = this.colors[`${i}`];
        this.controllerTextBook.getGroup({ wordGroup: i, wordPage: 0 });
      });
      if (i === wordGroup) {
        btn.classList.add('pressed');
        this.textBookContainer.style.backgroundColor = this.colors[`${i}`];
      }
      if (i === btnsCount - 1) {
        btn.innerText = 'Сложные';
        btn.classList.add('tb-group-hardbtn');
      }
      tbGroupBtns.appendChild(btn);
    }
    return tbGroupBtns;
  }

  drawPage(words: IWord[]) {
    this.pageContainer.innerHTML = '';
    words.forEach((word) => {
      this.pageContainer.appendChild(this.getCard(word));
    });
  }

  private getCard(word: IWord): HTMLDivElement {
    const cardWord = document.createElement('div');
    cardWord.dataset.tbwordid = word.id;
    cardWord.classList.add('tb-card-word');

    cardWord.innerHTML = `
      <div class="main-wrapper">
        <img class="word-picture" src="${this.baseURL}/${word.image}" alt="${word.word}" width="390" height="234">
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

  drawPagination({ wordPage, maxWordPage }: { wordPage: number; maxWordPage: number }) {
    this.paginationContainer.innerHTML = '';

    const btnPrevPage = document.createElement('button');
    btnPrevPage.classList.add('tb-prevPage-btn');
    btnPrevPage.addEventListener('click', () => this.controllerTextBook.getPrevPage());

    const pageNumberText = document.createElement('span');
    pageNumberText.innerText = `${wordPage + 1} / ${maxWordPage + 1}`;

    const btnNextPage = document.createElement('button');
    btnNextPage.classList.add('tb-nextPage-btn');
    btnNextPage.addEventListener('click', () => this.controllerTextBook.getNextPage());
    this.paginationContainer.append(btnPrevPage, pageNumberText, btnNextPage);

    if (wordPage === 0) btnPrevPage.disabled = true;
    if (wordPage === maxWordPage) btnNextPage.disabled = true;
  }
}
