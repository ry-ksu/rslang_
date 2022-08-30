import { IUserWord, IWord } from '../types/types';
import ControllerTextBook from './controller';

export default class ViewTextBook {
  private controllerTextBook: ControllerTextBook;

  private component: HTMLElement;

  private static textBookContainer: HTMLElement;

  private baseURL: string;

  private cardPerPage: number;

  private colors: {
    [key: string]: string;
  };

  constructor({
    controller,
    component,
    baseURL,
  }: {
    controller: ControllerTextBook;
    component: HTMLElement;
    baseURL: string;
  }) {
    this.controllerTextBook = controller;
    this.component = component;
    this.baseURL = baseURL;
    this.colors = {
      0: '#b7eee0',
      1: '#eee1b7',
      2: '#b7eeb7',
      3: '#cab7ee',
      4: '#b7e3ee',
      5: '#f2f7d5',
      6: '#e2a6a6',
    };
    this.cardPerPage = 20;
  }

  draw({
    words,
    wordGroup,
    wordPage,
    maxWordPage,
    userWords,
  }: {
    words: IWord[];
    wordGroup: number;
    wordPage: number;
    maxWordPage: number;
    userWords: IUserWord[];
  }) {
    ViewTextBook.textBookContainer = document.createElement('div');
    ViewTextBook.textBookContainer.classList.add('textbook-container');
    this.component.appendChild(ViewTextBook.textBookContainer);

    this.drawHeader({ wordGroup });
    this.drawPage({ words, userWords });
    this.drawPagination({ wordPage, maxWordPage });
  }

  drawHeader({ wordGroup }: { wordGroup: number }) {
    const headerContainer = document.createElement('div');
    headerContainer.classList.add('tb-header');

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
    headerContainer.append(tbGroupBtns, btnGames);

    ViewTextBook.textBookContainer.append(headerContainer);
  }

  private getHeaderBtns({ wordGroup }: { wordGroup: number }): HTMLDivElement {
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
        ViewTextBook.textBookContainer.style.backgroundColor = this.colors[`${i}`];
        this.controllerTextBook
          .getGroup({ wordGroup: i, wordPage: 0 })
          .catch((error) => console.error(error));
      });
      if (i === wordGroup) {
        btn.classList.add('pressed');
        ViewTextBook.textBookContainer.style.backgroundColor = this.colors[`${i}`];
      }
      if (i === this.controllerTextBook.hardGroupIndex) {
        btn.innerText = 'Сложные';
        btn.classList.add('tb-group-hardbtn');
      }
      tbGroupBtns.appendChild(btn);
    }
    return tbGroupBtns;
  }

  drawPage({ words, userWords }: { words: IWord[]; userWords: IUserWord[] }) {
    let pageContainer = ViewTextBook.textBookContainer?.querySelector('.tb-page');
    if (pageContainer) {
      pageContainer.innerHTML = '';
    } else {
      pageContainer = document.createElement('div');
      pageContainer.classList.add('tb-page');
      ViewTextBook.textBookContainer.append(pageContainer);
    }

    const countMarkedCard = words.filter((word) =>
      userWords.some(
        (userWord) =>
          userWord.wordId === word.id &&
          (userWord.difficulty === 'hard' || userWord.optional.isLearned === true)
      )
    ).length;
    if (countMarkedCard === this.cardPerPage)
      ViewTextBook.textBookContainer.classList.add('marked');
    else ViewTextBook.textBookContainer.classList.remove('marked');

    words.forEach((word) => {
      const userWord = userWords.find((item) => item.wordId === word.id);
      pageContainer?.appendChild(this.getCard({ word, userWord }));
    });
  }

  private getCard({ word, userWord }: { word: IWord; userWord?: IUserWord }): HTMLDivElement {
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
      </div>`;

    if (this.controllerTextBook.isUserRegistered()) {
      cardWord.append(this.getCardUserArea({ wordID: word.id, userWord }));
    }

    return cardWord;
  }

  getCardUserArea({ wordID, userWord }: { wordID: string; userWord?: IUserWord }) {
    const userWrapper = document.createElement('div');
    userWrapper.classList.add('user-wrapper');

    const btnsContainer = document.createElement('div');
    btnsContainer.classList.add('btns-container');
    const btnHard = document.createElement('button');
    btnHard.classList.add('btn-hard');
    btnHard.innerText = 'Сложное';

    if (userWord?.difficulty === 'hard') {
      btnHard.classList.add('pressed');
    }
    btnHard.addEventListener('click', () => {
      const isHardWord = btnHard.classList.contains('pressed');
      this.controllerTextBook
        .setHardWord({ isHardWord, wordID })
        .then(() => btnHard.classList.toggle('pressed'))
        .catch(() => null);
    });

    const btnLearned = document.createElement('button');
    btnLearned.classList.add('btn-learned');
    btnLearned.innerText = 'Изучено';

    if (userWord?.optional.isLearned) {
      btnLearned.classList.add('pressed');
    }

    btnLearned.addEventListener('click', () => {
      const isLearnedWord = btnLearned.classList.contains('pressed');
      this.controllerTextBook
        .setLearnedWord({ isLearnedWord, wordID })
        .then(() => btnLearned.classList.toggle('pressed'))
        .catch(() => null);
    });

    btnsContainer.append(btnHard, btnLearned);

    const footerWrapper = document.createElement('div');
    footerWrapper.classList.add('footer-wrapper');

    const rightContainer = document.createElement('div');
    rightContainer.classList.add('right-container');
    const rightSymbol = document.createElement('span');
    rightSymbol.classList.add('right-symbol');
    rightSymbol.innerText = '✔';
    const rightCount = document.createElement('span');
    rightCount.classList.add('right-count');
    rightCount.innerText = '0';
    rightContainer.append(rightSymbol, rightCount);

    const wrongContainer = document.createElement('div');
    wrongContainer.classList.add('wrong-container');
    const wrongSymbol = document.createElement('span');
    wrongSymbol.classList.add('wrong-symbol');
    wrongSymbol.innerText = '✖';
    const wrongCount = document.createElement('span');
    wrongCount.classList.add('wrong-count');
    wrongCount.innerText = '0';
    wrongContainer.append(wrongSymbol, wrongCount);

    footerWrapper.append(rightContainer, wrongContainer);
    userWrapper.append(btnsContainer, footerWrapper);

    return userWrapper;
  }

  drawPagination({ wordPage, maxWordPage }: { wordPage: number; maxWordPage: number }) {
    ViewTextBook?.textBookContainer?.querySelector('.tb-pagination')?.remove();
    const paginationContainer = document.createElement('div');
    paginationContainer.classList.add('tb-pagination');

    const btnPrevPage = document.createElement('button');
    btnPrevPage.classList.add('tb-prevPage-btn');
    btnPrevPage.addEventListener('click', () => this.controllerTextBook.getPrevPage());

    const pageNumberText = document.createElement('span');
    pageNumberText.innerText = `${wordPage + 1} / ${maxWordPage + 1}`;

    const btnNextPage = document.createElement('button');
    btnNextPage.classList.add('tb-nextPage-btn');
    btnNextPage.addEventListener('click', () => this.controllerTextBook.getNextPage());
    paginationContainer.append(btnPrevPage, pageNumberText, btnNextPage);

    if (wordPage === 0) btnPrevPage.disabled = true;
    if (wordPage === maxWordPage) btnNextPage.disabled = true;

    ViewTextBook.textBookContainer.append(paginationContainer);
  }
}
