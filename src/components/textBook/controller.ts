import ViewTextBook from './view';
import { IAttributes, IUserWord, IWord } from '../types/types';
import ControllerAuthorization from '../authorization/controller';

export default class ControllerTextBook {
  private viewTextBook: ViewTextBook;

  private maxWordPage: number;

  private attributes: IAttributes;

  private userWords: IUserWord[];

  hardGroupIndex = 6;

  private authorization: ControllerAuthorization;

  constructor({
    attributes,
    authorization,
  }: {
    attributes: IAttributes;
    authorization: ControllerAuthorization;
  }) {
    this.attributes = attributes;
    this.maxWordPage = 29;
    this.userWords = [];
    this.viewTextBook = new ViewTextBook({
      controller: this,
      component: attributes.component,
      baseURL: attributes.baseURL,
    });
    this.authorization = authorization;
  }

  async getData(): Promise<void> {
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

    let words: IWord[];
    if (wordGroup === this.hardGroupIndex) {
      words = await this.getHardGroup();
    } else {
      words = await this.attributes.wordsApi.getWords({
        wordGroup,
        wordPage,
      });
    }

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

  async getGroup({ wordGroup, wordPage }: { wordGroup: number; wordPage: number }): Promise<void> {
    let words: IWord[];
    try {
      await this.checkAuthorization();
      if (wordGroup === this.hardGroupIndex) {
        words = await this.getHardGroup();
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

  async getHardGroup(): Promise<IWord[]> {
    try {
      await this.checkAuthorization();
      const wordsPromises: Promise<IWord>[] = [];
      this.userWords.forEach((item) => {
        if (item.wordId !== undefined && item.difficulty === 'hard') {
          const word = this.attributes.wordsApi.getWord({ wordID: item.wordId });
          wordsPromises.push(word);
        }
      });
      return await Promise.all(wordsPromises);
    } catch (error) {
      throw Error();
    }
  }

  isUserRegistered(): boolean {
    return this.attributes.isUserAuth;
  }

  async checkAuthorization(): Promise<void> {
    try {
      await this.authorization.checkAuth();
      this.attributes.isUserAuth = true;
    } catch (error) {
      console.error(error);
    }
  }

  async setLearnedWord({
    isLearnedWord,
    wordID,
  }: {
    isLearnedWord: boolean;
    wordID: string;
  }): Promise<void> {
    if (!this.isUserRegistered()) return;
    const { token, userId: userID } = this.attributes.localStorage.getLS();
    const existsUserWord = this.userWords.find((item) => item.wordId === wordID);
    const isLearned = !isLearnedWord;
    try {
      if (existsUserWord) {
        existsUserWord.optional.isLearned = isLearned;
        const updatedUserWord: IUserWord = {
          difficulty: existsUserWord.difficulty,
          optional: existsUserWord.optional,
        };
        updatedUserWord.optional.isLearned = isLearned;
        await this.attributes.wordsApi.updateUserWord({
          userID,
          wordID,
          userWord: updatedUserWord,
          token,
        });
      } else {
        const newUserWord: IUserWord = {
          difficulty: 'weak',
          optional: {
            isLearned,
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

  async setHardWord({
    isHardWord,
    wordID,
  }: {
    isHardWord: boolean;
    wordID: string;
  }): Promise<void> {
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
