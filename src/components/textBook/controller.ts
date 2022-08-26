import ViewTextBook from "./view";
import Loader from "../../services/loader";
import WordsApi from "../../services/wordsAPI";

export default class ControllerTextBook {

  viewTextBook: ViewTextBook;

  wordPage: number;

  maxWordPage: number;

  wordsApi: WordsApi;

  constructor() {
    const main = document.createElement('main') as HTMLDivElement;
    main.style.padding = '50px';
    document.body.appendChild(main);
    this.viewTextBook = new ViewTextBook(main);
    this.wordPage = 0;
    this.maxWordPage = 29;
    this.wordsApi = new WordsApi({ LoaderService: Loader });
  }

  // getData(attributes: {
  //   baseURL: string;
  //   wordsApi: WordsApi;
  //   localStorage: LocalStorage;
  //   component: HTMLElement;
  // })

  async getData() {
    const wordGroup = 0;
    const words = await this.wordsApi.getWords({ wordGroup, wordPage: this.wordPage});
    this.viewTextBook.draw({ words, wordPage: this.wordPage, maxWordPage: this.maxWordPage});
    this.handleEvents();
  }

  handleEvents() {
    this.viewTextBook.textBookContainer.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target.classList.contains('tb-rightpage-btn')) {
        this.getNextPage();
        return;
      };
      if (target.classList.contains('tb-leftpage-btn')) {
        this.getPrevPage();
      };
    });
  }

  getNextPage() {
    if (this.wordPage < this.maxWordPage) {
      this.wordPage += 1;
      const wordGroup = 0;
      this.wordsApi.getWords({ wordGroup, wordPage: this.wordPage})
        .then((words) => {
          this.viewTextBook.drawPage(words);
        })
        .catch((error) => console.error(error));
      this.viewTextBook.drawPagination({wordPage: this.wordPage, maxWordPage: this.maxWordPage});
    }
  }

  getPrevPage() {
    if (this.wordPage > 0) {
      this.wordPage -= 1;
      const wordGroup = 0;
      this.wordsApi.getWords({ wordGroup, wordPage: this.wordPage})
        .then((words) => {
          this.viewTextBook.drawPage(words);
        })
        .catch((error) => console.error(error));
      this.viewTextBook.drawPagination({wordPage: this.wordPage, maxWordPage: this.maxWordPage});
    }
  }

}