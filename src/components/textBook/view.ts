import { IUserWord, IWord } from '../types/types';
import ControllerTextBook from './controller';

export default class ViewTextBook {
  private controllerTextBook: ControllerTextBook;

  private component: HTMLElement;

  private static textBookContainer: HTMLElement;

  private baseURL: string;

  private cardsPage: HTMLDivElement[] = [];

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
    this.drawPage({ wordGroup, words, userWords });
    this.drawPagination({ wordGroup, wordPage, maxWordPage });
  }

  drawHeader({ wordGroup }: { wordGroup: number }) {
    const headerContainer = document.createElement('div');
    headerContainer.classList.add('tb-header');

    const tbGroupBtns = this.getHeaderBtns({ wordGroup });
    const btnGames = this.getGameBtns();
    headerContainer.append(tbGroupBtns, btnGames);

    ViewTextBook.textBookContainer.append(headerContainer);
  }

  private getHeaderBtns({ wordGroup }: { wordGroup: number }): HTMLDivElement {
    const tbGroupBtns = document.createElement('div');
    tbGroupBtns.classList.add('tb-group-btns');
    const btnsCount = 6;
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
      tbGroupBtns.appendChild(btn);
    }

    if (this.controllerTextBook.isUserRegistered()) {
      tbGroupBtns.appendChild(this.getHeaderHardButton({ wordGroup }));
    }
    return tbGroupBtns;
  }

  private getHeaderHardButton({ wordGroup }: { wordGroup: number }): HTMLButtonElement {
    const btn = document.createElement('button');
    btn.dataset.tbgroup = `${this.controllerTextBook.hardGroupIndex}`;
    btn.classList.add('tb-group-btn', 'group-btn', 'tb-group-hardbtn');
    btn.innerText = 'Сложные';
    btn.style.backgroundColor = this.colors[`${this.controllerTextBook.hardGroupIndex}`];
    if (this.controllerTextBook.hardGroupIndex === wordGroup) {
      btn.classList.add('pressed');
      ViewTextBook.textBookContainer.style.backgroundColor = this.colors[wordGroup];
    }

    btn.addEventListener('click', () => {
      this.component
        .querySelectorAll('.group-btn')
        .forEach((item) => item.classList.remove('pressed'));
      btn.classList.add('pressed');
      ViewTextBook.textBookContainer.style.backgroundColor =
        this.colors[`${this.controllerTextBook.hardGroupIndex}`];
      ViewTextBook.textBookContainer.classList.remove('marked');
      this.controllerTextBook
        .getGroup({ wordGroup: this.controllerTextBook.hardGroupIndex, wordPage: 0 })
        .catch((error) => console.error(error));
    });
    return btn;
  }

  private getGameBtns(): HTMLDivElement {
    const btnGames = document.createElement('div');
    btnGames.classList.add('tb-games-btns');
    const btnSprintGame = document.createElement('button');
    btnSprintGame.classList.add('tb-sprintgame-btn');
    btnSprintGame.innerText = `🏃Спринт`;
    btnSprintGame.dataset.page = 'sprint';
    btnSprintGame.addEventListener('click', () => {
      if (btnSprintGame.dataset.page) this.controllerTextBook.runGame(btnSprintGame.dataset.page);
    });

    const btnAudioGame = document.createElement('button');
    btnAudioGame.classList.add('tb-audiogame-btn');
    btnAudioGame.innerText = `🎧Аудиовызов`;
    btnAudioGame.dataset.page = 'audioGame';
    btnAudioGame.addEventListener('click', () => {
      if (btnAudioGame.dataset.page) this.controllerTextBook.runGame(btnAudioGame.dataset.page);
    });
    btnGames.append(btnSprintGame, btnAudioGame);
    return btnGames;
  }

  drawPage({
    wordGroup,
    words,
    userWords,
  }: {
    wordGroup: number;
    words: IWord[];
    userWords: IUserWord[];
  }) {
    this.cardsPage = [];
    let pageContainer = ViewTextBook.textBookContainer?.querySelector('.tb-page');
    if (pageContainer) {
      pageContainer.innerHTML = '';
    } else {
      pageContainer = document.createElement('div');
      pageContainer.classList.add('tb-page');
      ViewTextBook.textBookContainer.append(pageContainer);
    }
    words.forEach((word) => {
      const userWord = userWords.find((item) => item.wordId === word.id);
      pageContainer?.appendChild(this.getCard({ wordGroup, word, userWord }));
    });
    this.checkIsAllCardMarked();
  }

  private getCard({
    wordGroup,
    word,
    userWord,
  }: {
    wordGroup: number;
    word: IWord;
    userWord?: IUserWord;
  }): HTMLDivElement {
    const cardWord = document.createElement('div');
    cardWord.dataset.tbwordid = word.id;
    cardWord.classList.add('tb-card-word');
    this.cardsPage.push(cardWord);

    const mainWrapper = document.createElement('div');
    mainWrapper.classList.add('main-wrapper');

    const wordPicture = document.createElement('img');
    wordPicture.classList.add('word-picture');
    wordPicture.src = `${this.baseURL}/${word.image}`;
    wordPicture.alt = `${word.word}`;
    wordPicture.width = 390;
    wordPicture.height = 234;

    const cardContent = document.createElement('div');
    cardContent.classList.add('card-content');

    const wordTranslate = document.createElement('p');
    wordTranslate.classList.add('word-translate');
    wordTranslate.innerText = `${word.word} - ${word.transcription} - ${word.wordTranslate}`;
    wordTranslate.addEventListener('click', () => {
      const audio = document.createElement('audio');
      audio.src = `${this.baseURL}/${word.audio}`;
      audio.play().catch((error) => console.error(error));
      audio.remove();
    });

    const textMeaning = document.createElement('p');
    textMeaning.classList.add('text-meaning');
    textMeaning.innerHTML = `${word.textMeaning}<br>${word.textMeaningTranslate}`;
    textMeaning.addEventListener('click', () => {
      const audio = document.createElement('audio');
      audio.src = `${this.baseURL}/${word.audioMeaning}`;
      audio.play().catch((error) => console.error(error));
      audio.remove();
    });

    const textExample = document.createElement('p');
    textExample.classList.add('text-example');
    textExample.innerHTML = `${word.textExample}<br>${word.textExampleTranslate}`;
    textExample.addEventListener('click', () => {
      const audio = document.createElement('audio');
      audio.src = `${this.baseURL}/${word.audioExample}`;
      audio.play().catch((error) => console.error(error));
      audio.remove();
    });

    cardContent.append(wordTranslate, textMeaning, textExample);
    mainWrapper.append(wordPicture, cardContent);
    cardWord.append(mainWrapper);
    if (this.controllerTextBook.isUserRegistered()) {
      cardContent.classList.remove('unregistered');
      cardWord.append(this.getCardUserArea({ wordGroup, wordID: word.id, userWord, cardWord }));
    } else {
      cardContent.classList.add('unregistered');
    }
    return cardWord;
  }

  getCardUserArea({
    wordGroup,
    wordID,
    userWord,
    cardWord,
  }: {
    wordGroup: number;
    wordID: string;
    userWord?: IUserWord;
    cardWord: HTMLDivElement;
  }) {
    const userWrapper = document.createElement('div');
    userWrapper.classList.add('user-wrapper');
    const btnsContainer = this.getMarkedBtns({ wordGroup, wordID, userWord, cardWord });
    const footerWrapper = document.createElement('div');
    footerWrapper.classList.add('tbfooter-wrapper');

    const rightContainer = document.createElement('div');
    rightContainer.classList.add('right-container');
    const rightSymbol = document.createElement('span');
    rightSymbol.classList.add('right-symbol');
    rightSymbol.innerText = '✔';
    const rightCount = document.createElement('span');
    rightCount.classList.add('right-count');
    rightCount.innerText = `${userWord?.optional.rightAnswerCount || 0}`;
    rightContainer.append(rightSymbol, rightCount);

    const wrongContainer = document.createElement('div');
    wrongContainer.classList.add('wrong-container');
    const wrongSymbol = document.createElement('span');
    wrongSymbol.classList.add('wrong-symbol');
    wrongSymbol.innerText = '✖';
    const wrongCount = document.createElement('span');
    wrongCount.classList.add('wrong-count');
    wrongCount.innerText = `${userWord?.optional.wrongAnswerCount || 0}`;
    wrongContainer.append(wrongSymbol, wrongCount);

    footerWrapper.append(rightContainer, wrongContainer);
    userWrapper.append(btnsContainer, footerWrapper);

    return userWrapper;
  }

  getMarkedBtns({
    wordGroup,
    wordID,
    userWord,
    cardWord,
  }: {
    wordGroup: number;
    wordID: string;
    userWord?: IUserWord;
    cardWord: HTMLDivElement;
  }) {
    const card = cardWord;
    const btnsContainer = document.createElement('div');
    btnsContainer.classList.add('btns-container');
    const btnHard = document.createElement('button');
    btnHard.classList.add('btn-hard');
    btnHard.innerText = 'Сложное';

    if (userWord?.difficulty === 'hard') {
      btnHard.classList.add('pressed');
      card.dataset.ishardword = 'true';
    }

    const btnLearned = document.createElement('button');
    btnLearned.classList.add('btn-learned');
    btnLearned.innerText = 'Изучено';

    if (userWord?.optional.isLearned) {
      btnLearned.classList.add('pressed');
      card.dataset.islearnedword = 'true';
    }

    btnHard.addEventListener('click', () => {
      const isHardBtnPressed = btnHard.classList.contains('pressed');
      const isLearnedBtnPressed = btnLearned.classList.contains('pressed');
      const isHardWord = !isHardBtnPressed;
      const isLearnedWord = isHardWord ? !isHardWord : isLearnedBtnPressed;

      this.controllerTextBook
        .setMarkedWord({ isLearnedWord, isHardWord, wordID })
        .then(() => {
          btnHard.classList.toggle('pressed');
          card.dataset.ishardword = isHardWord ? 'true' : 'false';
          if (isHardWord) {
            btnLearned.classList.remove('pressed');
            card.dataset.islearnedword = 'false';
          }
          this.checkIsAllCardMarked();
          if (
            wordGroup === this.controllerTextBook.hardGroupIndex &&
            card.dataset.ishardword === 'false'
          ) {
            this.cardsPage = this.cardsPage.filter((item) => item !== card);
            card.remove();
          }
        })
        .catch(() => null);
    });

    btnLearned.addEventListener('click', () => {
      const isLearnedBtnPressed = btnLearned.classList.contains('pressed');
      const isHardBtnPressed = btnHard.classList.contains('pressed');
      const isLearnedWord = !isLearnedBtnPressed;
      const isHardWord = isLearnedWord ? !isLearnedWord : isHardBtnPressed;

      this.controllerTextBook
        .setMarkedWord({ isLearnedWord, isHardWord, wordID })
        .then(() => {
          btnLearned.classList.toggle('pressed');
          card.dataset.islearnedword = isLearnedWord ? 'true' : 'false';
          if (isLearnedWord) {
            btnHard.classList.remove('pressed');
            card.dataset.ishardword = 'false';
          }
          this.checkIsAllCardMarked();
          if (
            wordGroup === this.controllerTextBook.hardGroupIndex &&
            card.dataset.ishardword === 'false'
          ) {
            this.cardsPage = this.cardsPage.filter((item) => item !== card);
            card.remove();
          }
          this.checkIsAllCardMarked();
        })
        .catch(() => null);
    });

    btnsContainer.append(btnHard, btnLearned);
    return btnsContainer;
  }

  drawPagination({
    wordGroup,
    wordPage,
    maxWordPage,
  }: {
    wordGroup: number;
    wordPage: number;
    maxWordPage: number;
  }) {
    ViewTextBook?.textBookContainer?.querySelector('.tb-pagination')?.remove();
    if (this.controllerTextBook.hardGroupIndex === wordGroup) return;
    const paginationContainer = document.createElement('div');
    paginationContainer.classList.add('tb-pagination');

    const btnPrevPage = document.createElement('button');
    btnPrevPage.classList.add('tb-prevPage-btn');
    btnPrevPage.addEventListener(
      'click',
      () => {
        this.controllerTextBook.getPrevPage();
      },
      { once: true }
    );

    const pageNumberText = document.createElement('span');
    pageNumberText.innerText = `${wordPage + 1} / ${maxWordPage + 1}`;

    const btnNextPage = document.createElement('button');
    btnNextPage.classList.add('tb-nextPage-btn');
    btnNextPage.addEventListener(
      'click',
      () => {
        this.controllerTextBook.getNextPage();
      },
      { once: true }
    );
    paginationContainer.append(btnPrevPage, pageNumberText, btnNextPage);

    if (wordPage === 0) btnPrevPage.disabled = true;
    if (wordPage === maxWordPage) btnNextPage.disabled = true;

    ViewTextBook.textBookContainer.append(paginationContainer);
  }

  checkIsAllCardMarked() {
    const countMarkedCards = this.cardsPage.filter(
      (card) => card.dataset.islearnedword === 'true'
    ).length;
    const btnSprintGame = document.querySelector('button.tb-sprintgame-btn') as HTMLButtonElement;
    const btnAudioGame = document.querySelector('button.tb-audiogame-btn') as HTMLButtonElement;

    if (countMarkedCards === this.controllerTextBook.countCardsPerPage) {
      ViewTextBook.textBookContainer.classList.add('marked');
      btnSprintGame.disabled = true;
      btnAudioGame.disabled = true;
    } else {
      ViewTextBook.textBookContainer.classList.remove('marked');
      btnSprintGame.disabled = false;
      btnAudioGame.disabled = false;
    }
  }
}
