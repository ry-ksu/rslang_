import ViewTextBook from './view';
import { IAttributes, IUserWord, IWord } from '../types/types';

export default class ControllerTextBook {
  private viewTextBook: ViewTextBook;

  private maxWordPage: number;

  private attributes: IAttributes;

  private userWords: IUserWord[];

  hardGroupIndex = 6;

  constructor(attributes: IAttributes) {
    this.attributes = attributes;
    this.maxWordPage = 29;
    this.userWords = [];
    this.viewTextBook = new ViewTextBook({
      controller: this,
      component: attributes.component,
      baseURL: attributes.baseURL,
    });
  }

  async getData() {
    const ls = this.attributes.localStorage.getLS();
    let wordGroup = 0;
    let wordPage = 0;
    if (ls.groupTB && ls.pageTB) {
      wordGroup = parseInt(ls.groupTB, 10);
      wordPage = parseInt(ls.pageTB, 10);
    } else {
      this.attributes.localStorage.changeLS('groupTB', '0');
      this.attributes.localStorage.changeLS('pageTB', '0');
    }

    const { token, userId: userID } = this.attributes.localStorage.getLS();

    if (this.isUserRegistered()) {
      this.userWords = await this.attributes.wordsApi.getUserWords({ userID, token });
    }

    const words = await this.attributes.wordsApi.getWords({
      wordGroup,
      wordPage,
    });

    this.viewTextBook.draw({
      words,
      wordGroup,
      wordPage,
      maxWordPage: this.maxWordPage,
      userWords: this.userWords,
    });
  }

  getNextPage() {
    const ls = this.attributes.localStorage.getLS();
    const wordGroup = parseInt(ls.groupTB, 10);
    let wordPage = parseInt(ls.pageTB, 10);

    if (wordPage < this.maxWordPage) {
      wordPage += 1;
      this.attributes.localStorage.changeLS('pageTB', `${wordPage}`);
      this.attributes.wordsApi
        .getWords({ wordGroup, wordPage })
        .then((words) => {
          this.viewTextBook.drawPage({ words, userWords: this.userWords });
        })
        .catch((error) => console.error(error));
      this.viewTextBook.drawPagination({ wordPage, maxWordPage: this.maxWordPage });
    }
  }

  getPrevPage() {
    const ls = this.attributes.localStorage.getLS();
    const wordGroup = parseInt(ls.groupTB, 10);
    let wordPage = parseInt(ls.pageTB, 10);

    if (wordPage > 0) {
      wordPage -= 1;
      this.attributes.localStorage.changeLS('pageTB', `${wordPage}`);
      this.attributes.wordsApi
        .getWords({ wordGroup, wordPage })
        .then((words) => {
          this.viewTextBook.drawPage({ words, userWords: this.userWords });
        })
        .catch((error) => console.error(error));
      this.viewTextBook.drawPagination({ wordPage, maxWordPage: this.maxWordPage });
    }
  }

  async getGroup({ wordGroup, wordPage }: { wordGroup: number; wordPage: number }) {
    let words: IWord[];
    try {
      if (wordGroup === this.hardGroupIndex) {
        const wordsPromises: Promise<IWord>[] = [];
        this.userWords.forEach((item) => {
          if (item.wordId !== undefined && item.difficulty === 'hard') {
            const word = this.attributes.wordsApi.getWord({ wordID: item.wordId });
            wordsPromises.push(word);
          }
        });
        words = await Promise.all(wordsPromises);
      } else {
        words = await this.attributes.wordsApi.getWords({ wordGroup, wordPage });
      }
      this.attributes.localStorage.changeLS('groupTB', `${wordGroup}`);
      this.attributes.localStorage.changeLS('pageTB', `${wordPage}`);
      this.viewTextBook.drawPage({ words, userWords: this.userWords });
      this.viewTextBook.drawPagination({ wordPage, maxWordPage: this.maxWordPage });
    } catch (error) {
      console.error(error);
    }
  }

  isUserRegistered(): boolean {
    return this.attributes.isUserAuth;
  }

  async setHardWord({ isHardWord, wordID }: { isHardWord: boolean; wordID: string }) {
    if (!this.isUserRegistered()) return;
    const { token, userId: userID } = this.attributes.localStorage.getLS();
    const existsUserWord = this.userWords.find((item) => item.wordId === wordID);
    const difficulty = isHardWord ? 'weak' : 'hard';
    try {
      if (existsUserWord) {
        existsUserWord.difficulty = difficulty;
        const updatedUserWord: IUserWord = {
          difficulty,
          optional: existsUserWord.optional,
        };
        await this.attributes.wordsApi.updateUserWord({
          userID,
          wordID,
          userWord: updatedUserWord,
          token,
        });
      } else {
        const newUserWord: IUserWord = {
          difficulty,
          optional: {
            isLearned: false,
            currentProgress: 0,
            rightAnswerCount: 0,
            wrongAnswerCount: 0,
          },
        };
        await this.attributes.wordsApi.createUserWord({
          userID,
          wordID,
          userWord: newUserWord,
          token,
        });
        newUserWord.wordId = wordID;
        this.userWords.push(newUserWord);
      }
    } catch (error) {
      console.error(error);
    }
  }
}
