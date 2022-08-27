import ViewTextBook from './view';
import WordsApi from '../../services/wordsAPI';
import LocalStorage from '../../services/store';

export default class ControllerTextBook {
  private viewTextBook: ViewTextBook;

  private wordPage: number;

  private maxWordPage: number;

  private wordGroup: number;

  private wordsApi: WordsApi;

  private baseURL: string;

  private localStorage: LocalStorage;

  private component: HTMLElement;

  constructor(attributes: {
    baseURL: string;
    wordsApi: WordsApi;
    localStorage: LocalStorage;
    component: HTMLElement;
  }) {
    document.body.querySelector('main')?.remove();
    const main = document.createElement('main');
    document.body.appendChild(main);

    this.viewTextBook = new ViewTextBook({ controller: this, component: main });

    this.wordGroup = 0;
    this.wordPage = 0;
    this.maxWordPage = 29;
    this.wordsApi = attributes.wordsApi;
    this.baseURL = attributes.baseURL;
    this.localStorage = attributes.localStorage;
    this.component = attributes.component;
  }

  async getData() {
    const words = await this.wordsApi.getWords({
      wordGroup: this.wordGroup,
      wordPage: this.wordPage,
    });
    this.viewTextBook.draw({
      words,
      wordGroup: this.wordGroup,
      wordPage: this.wordPage,
      maxWordPage: this.maxWordPage,
    });
  }

  getNextPage() {
    console.log('getNextPage');
    if (this.wordPage < this.maxWordPage) {
      this.wordPage += 1;
      const wordGroup = 0;
      this.wordsApi
        .getWords({ wordGroup, wordPage: this.wordPage })
        .then((words) => {
          this.viewTextBook.drawPage(words);
        })
        .catch((error) => console.error(error));
      this.viewTextBook.drawPagination({ wordPage: this.wordPage, maxWordPage: this.maxWordPage });
    }
  }

  getPrevPage() {
    if (this.wordPage > 0) {
      this.wordPage -= 1;
      const wordGroup = 0;
      this.wordsApi
        .getWords({ wordGroup, wordPage: this.wordPage })
        .then((words) => {
          this.viewTextBook.drawPage(words);
        })
        .catch((error) => console.error(error));
      this.viewTextBook.drawPagination({ wordPage: this.wordPage, maxWordPage: this.maxWordPage });
    }
  }

  getGroup({ wordGroup, wordPage }: { wordGroup: number; wordPage: number }) {
    this.wordsApi
      .getWords({ wordGroup, wordPage })
      .then((words) => {
        this.viewTextBook.drawPage(words);
      })
      .catch((error) => console.error(error));
    this.viewTextBook.drawPagination({ wordPage, maxWordPage: this.maxWordPage });
  }
}
