import ViewTextBook from './view';
import WordsApi from '../../services/wordsAPI';
import LocalStorage from '../../services/store';

export default class ControllerTextBook {
  private viewTextBook: ViewTextBook;

  // private wordPage: number;

  private maxWordPage: number;

  // private wordGroup: number;

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

    this.maxWordPage = 29;
    this.wordsApi = attributes.wordsApi;
    this.baseURL = attributes.baseURL;
    this.localStorage = attributes.localStorage;
    this.component = attributes.component;
  }

  async getData() {
    const ls = this.localStorage.getLS();
    let wordGroup = 0; 
    let wordPage = 0;
    if (ls.groupTB && ls.pageTB) {
      wordGroup = parseInt(ls.groupTB, 10);
      wordPage = parseInt(ls.pageTB, 10);
    } else {
      this.localStorage.changeLS('groupTB', '0');
      this.localStorage.changeLS('pageTB', '0');
    }

    const words = await this.wordsApi.getWords({
      wordGroup,
      wordPage,
    });

    this.viewTextBook.draw({
      words,
      wordGroup,
      wordPage,
      maxWordPage: this.maxWordPage,
    });
  }

  getNextPage() {
    const ls = this.localStorage.getLS();
    const wordGroup = parseInt(ls.groupTB, 10);
    let wordPage = parseInt(ls.pageTB, 10);

    if (wordPage < this.maxWordPage) {
      wordPage += 1;
      this.localStorage.changeLS('pageTB', `${ wordPage }`);
      this.wordsApi
        .getWords({ wordGroup, wordPage })
        .then((words) => {
          this.viewTextBook.drawPage(words);
        })
        .catch((error) => console.error(error));
      this.viewTextBook.drawPagination({ wordPage, maxWordPage: this.maxWordPage });
    }
  }

  getPrevPage() {
    const ls = this.localStorage.getLS();
    const wordGroup = parseInt(ls.groupTB, 10);
    let wordPage = parseInt(ls.pageTB, 10);

    if (wordPage > 0) {
      wordPage -= 1;
      this.localStorage.changeLS('pageTB', `${ wordPage }`);
      this.wordsApi
        .getWords({ wordGroup, wordPage })
        .then((words) => {
          this.viewTextBook.drawPage(words);
        })
        .catch((error) => console.error(error));
      this.viewTextBook.drawPagination({ wordPage, maxWordPage: this.maxWordPage });
    }
  }

  getGroup({ wordGroup, wordPage }: { wordGroup: number; wordPage: number }) {

    this.wordsApi
      .getWords({ wordGroup, wordPage })
      .then((words) => {
        this.localStorage.changeLS('groupTB', `${wordGroup}`);
        this.localStorage.changeLS('pageTB', `${wordPage}`);
        this.viewTextBook.drawPage(words);
      })
      .catch((error) => console.error(error));
    this.viewTextBook.drawPagination({ wordPage, maxWordPage: this.maxWordPage });
  }
}
