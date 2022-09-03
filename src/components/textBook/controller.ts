import ViewTextBook from './view';
import { IAttributes, IUserStatistics, IUserWord, IWord } from '../types/types';
import ControllerAuthorization from '../authorization/controller';
import App from '../app';

export default class ControllerTextBook {
  private viewTextBook: ViewTextBook;

  private maxWordPage = 29;

  private attributes: IAttributes;

  private userWords: IUserWord[] = [];

  private wordsPage: IWord[] = [];

  readonly hardGroupIndex = 6;

  readonly countCardsPerPage = 20;

  private authorization: ControllerAuthorization;

  private app: App;

  constructor(app: App) {
    this.app = app;
    this.attributes = app.attributes;
    this.viewTextBook = new ViewTextBook({
      controller: this,
      component: this.attributes.component,
      baseURL: this.attributes.baseURL,
    });
    this.authorization = app.controllerAuthorization;
  }

  async getData(): Promise<void> {
    const ls = this.attributes.localStorage.getLS();
    let wordGroup = 0;
    let wordPage = 0;
    // check page & group
    if (ls.groupTB && ls.pageTB) {
      wordGroup = parseInt(ls.groupTB, 10);
      wordPage = parseInt(ls.pageTB, 10);
      if (wordGroup === this.hardGroupIndex && !this.isUserRegistered()) {
        wordGroup = 0;
        wordPage = 0;
        this.attributes.localStorage.changeLS('groupTB', '0');
        this.attributes.localStorage.changeLS('pageTB', '0');
      }
    } else {
      this.attributes.localStorage.changeLS('groupTB', '0');
      this.attributes.localStorage.changeLS('pageTB', '0');
    }
    // check authorization
    const { token, userId: userID } = ls;
    if (token && userID && this.isUserRegistered()) {
      this.userWords = await this.attributes.wordsApi.getUserWords({ userID, token });
    }
    // load data & draw
    let words: IWord[];
    if (wordGroup === this.hardGroupIndex && this.isUserRegistered()) {
      words = await this.getHardGroup();
    } else {
      words = await this.attributes.wordsApi.getWords({
        wordGroup,
        wordPage,
      });
    }
    this.wordsPage = words;
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
      this.getPage({ wordGroup, wordPage })
        .then((words) => {
          this.viewTextBook.drawPage({ wordGroup, words, userWords: this.userWords });
        })
        .catch((error) => console.error(error));
      this.viewTextBook.drawPagination({ wordGroup, wordPage, maxWordPage: this.maxWordPage });
    }
  }

  getPrevPage() {
    const ls = this.attributes.localStorage.getLS();
    const wordGroup = parseInt(ls.groupTB, 10);
    let wordPage = parseInt(ls.pageTB, 10);

    if (wordPage > 0) {
      wordPage -= 1;
      this.getPage({ wordGroup, wordPage })
        .then((words) => {
          this.viewTextBook.drawPage({ wordGroup, words, userWords: this.userWords });
        })
        .catch((error) => console.error(error));
      this.viewTextBook.drawPagination({ wordGroup, wordPage, maxWordPage: this.maxWordPage });
    }
  }

  private async getPage({ wordGroup, wordPage }: { wordGroup: number; wordPage: number }) {
    try {
      await this.checkAuthorization();
      this.attributes.localStorage.changeLS('pageTB', `${wordPage}`);
      const words = await this.attributes.wordsApi.getWords({ wordGroup, wordPage });
      this.wordsPage = words;
      return words;
    } catch (error) {
      throw new Error('Words fetching error');
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
      this.wordsPage = words;
      this.viewTextBook.drawPage({ wordGroup, words, userWords: this.userWords });
      this.viewTextBook.drawPagination({ wordGroup, wordPage, maxWordPage: this.maxWordPage });
    } catch {
      throw new Error('Get words group error');
    }
  }

  private async getHardGroup(): Promise<IWord[]> {
    try {
      const words: Promise<IWord>[] = [];
      await this.checkAuthorization();
      if (!this.isUserRegistered()) return Promise.all(words);
      this.userWords.forEach((item) => {
        if (item.wordId !== undefined && item.difficulty === 'hard') {
          const word = this.attributes.wordsApi.getWord({ wordID: item.wordId });
          words.push(word);
        }
      });
      return await Promise.all(words);
    } catch {
      throw new Error('Get hard group error');
    }
  }

  isUserRegistered(): boolean {
    return this.attributes.isUserAuth;
  }

  private async checkAuthorization(): Promise<void> {
    try {
      await this.authorization.checkAuth();
      this.attributes.isUserAuth = true;
    } catch (error) {
      this.attributes.isUserAuth = false;
    }
  }

  async setMarkedWord({
    isLearnedWord,
    isHardWord,
    wordID,
  }: {
    isLearnedWord: boolean;
    isHardWord: boolean;
    wordID: string;
  }) {
    if (!this.isUserRegistered()) return;
    const { token, userId: userID } = this.attributes.localStorage.getLS();
    const existsUserWord = this.userWords.find((item) => item.wordId === wordID);
    const isLearned = isLearnedWord;
    const difficulty = isHardWord ? 'hard' : 'weak';
    try {
      if (existsUserWord) {
        existsUserWord.optional.isLearned = isLearned;
        existsUserWord.difficulty = difficulty;
        const updatedUserWord: IUserWord = {
          difficulty: existsUserWord.difficulty,
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
      await this.updateLearnedWordsStatistics({token, userID});
    } catch (error) {
      console.error(error);
    }
  }

  private async updateLearnedWordsStatistics({ token, userID }: { token: string, userID: string }) {
    try {
      const allLearnedUserWords: string[] = [];
      this.userWords.forEach((item) => {
        if (typeof (item.wordId) === 'string' && item.optional.isLearned === true) {
          allLearnedUserWords.push(item.wordId)
        };
      });
      const currentStat = await this.attributes.wordsApi.getUserStatistics({ token, userID });
      const longStatDaysCount: number = currentStat.optional.longStatistics.days.length;
      const previousLongStatLearnedWords = longStatDaysCount > 1
        ? currentStat.optional.longStatistics.days[longStatDaysCount - 2]
        : null;

      currentStat.optional.longStatistics.days[longStatDaysCount - 1].learnedWords = allLearnedUserWords;
      currentStat.optional.todayStatistics.learnedWords = previousLongStatLearnedWords
        ? allLearnedUserWords.filter((learnedWord) => (
          !previousLongStatLearnedWords.learnedWords.includes(learnedWord)
        ))
        : allLearnedUserWords;

      const updatedStat: IUserStatistics = {
        learnedWords: currentStat.learnedWords,
        optional: currentStat.optional
      };

      await this.attributes.wordsApi.updateUserStatistics({ userID, userStatistics: updatedStat, token });
    } catch (error) {
      console.error(error);
    }
  }

  private async getWordsForGame() {
    const getUnLearnedWords = (userWords: IUserWord[], words: IWord[]): IWord[] =>
      words.filter((word) =>
        userWords.every(
          (userWord) =>
            word.id !== userWord.wordId ||
            (word.id === userWord.wordId && userWord.optional.isLearned !== true)
        )
      );
    const unMarkedWords = getUnLearnedWords(this.userWords, this.wordsPage);
    const { groupTB, pageTB } = this.attributes.localStorage.getLS();
    const wordGroup = parseInt(groupTB, 10);
    const wordPage = parseInt(pageTB, 10);
    if (unMarkedWords.length < this.countCardsPerPage && wordPage > 0) {
      try {
        const pagePromise: Promise<IWord[]>[] = [];
        for (let i = wordPage - 1; i >= 0; i -= 1) {
          pagePromise.push(this.getPage({ wordGroup, wordPage: i }));
        }
        const otherWords = (await Promise.all(pagePromise)).flat();
        const unmarkedOtherWords = getUnLearnedWords(this.userWords, otherWords);
        const countDifference = this.countCardsPerPage - unMarkedWords.length;
        unMarkedWords.push(...unmarkedOtherWords.slice(0, countDifference));
        return unMarkedWords;
      } catch (error) {
        console.error(error);
      }
    }
    return unMarkedWords;
  }

  runGame(page: string) {
    this.attributes.localStorage.changeLS('page', page);
    this.attributes.component.innerHTML = '';
    if (this.isUserRegistered()) {
      this.getWordsForGame()
        .then((words) => this.app.controllers.games.getData(words))
        .catch((error) => console.error(error));
    } else {
      this.app.controllers.games.getData(this.wordsPage);
    }
  }
}
