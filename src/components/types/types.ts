import WordsApi from '../../services/wordsAPI';
import LocalStorage from '../../services/store';

// API types & interfaces

export type ILocalStorage = {
  token: string;
  refreshToken: string;
  userId: string;
  name: string;
  page: string;
  groupTB: string;
  pageTB: string;
};

export interface ILoader {
  makeRequest<T>({ url, options }: { url: string; options?: RequestInit }): Promise<T>;
}

export interface ILoaderContructable {
  new (): ILoader;
}

export interface IWord {
  id: string;
  group: number;
  page: number;
  word: string;
  image: string;
  audio: string;
  audioMeaning: string;
  audioExample: string;
  textMeaning: string;
  textExample: string;
  transcription: string;
  wordTranslate: string;
  textMeaningTranslate: string;
  textExampleTranslate: string;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
}

export interface IUserToken {
  message: string;
  token: string;
  refreshToken: string;
  userId: string;
  name: string;
}

export interface IUserWord {
  difficulty: 'weak' | 'hard';
  optional: {
    isLearned: boolean;
    currentProgress: number;
    rightAnswerCount: number;
    wrongAnswerCount: number;
  };
  wordId?: string;
}

export type IUserStatisticsGameOption = 'audioGame' | 'sprint';

export interface IUserStatistics {
  learnedWords: number;
  optional: {
    todayStatistics: {
      date: number;
      learnedWords: string[];
      audioGame: {
        newWords: string[];
        successWords: string[];
        failWords: string[];
        rightSeries: number;
      };
      sprint: {
        newWords: string[];
        successWords: string[];
        failWords: string[];
        rightSeries: number;
      };
    };
    longStatistics: {
      days: {
        date: number;
        newWords: string[];
        learnedWords: string[];
      }[];
    };
  };
}

export type IGamePack = {
  img: string;
  enRightWord: string;
  enSound: string;
  ruRightWord: string;
  ruMixWords: string[];
};

export type IAttributes = {
  baseURL: string;
  wordsApi: WordsApi;
  localStorage: LocalStorage;
  component: HTMLElement;
  isUserAuth: boolean;
};

export type voidFn = () => void;

export type IGameCurrentResult = {
  newWords: string[];
  successWords: {
    enWord: string;
    ruWord: string;
    sound: string;
    id?: string;
  }[];
  failWords: {
    enWord: string;
    ruWord: string;
    sound: string;
    id?: string;
  }[];
  currentSeries: number;
  rightSeries: number;
};

export type IGameCurrentResultForStats = {
  learnedWords: string[];
  newWords: string[];
  successWords: string[];
  failWords: string[];
  bestSeries: number;
};

export type IWrongWordsArray = {
  ruWord: string;
  enWord: string;
  soundWord: string;
};
