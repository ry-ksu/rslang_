// API types & interfaces

export type TEndpointWord = 'getWords' | 'getWordsPage' | 'getWord';

export type TEndpointUser = 'newUser' | 'getUser' | 'getToken' | 'signin';

export type TEndpointUserWord =
  | 'getUserWords'
  | 'getUserWord'
  | 'newUserWord'
  | 'updateUserWord'
  | 'deleteUserWord';

export type TEndpointStatistics = 'getUserStatistics' | 'updateUserStatistics';

export type TEndpoints = TEndpointWord | TEndpointUser | TEndpointUserWord | TEndpointStatistics;

export type TQueryString = {
  [key in TEndpoints]: string;
};

export type TUserOption = {
  userID?: string;
  wordID?: string;
};

export type TWordPageOption = {
  wordGroup?: string;
  wordPage?: string;
};

export type TAuthOption = {
  name?: string;
  email?: string;
  password?: string;
  token?: string;
};

export type TUserWord = {
  userWord?: {
    difficulty?: string;
    optional?: {
      isLearned: boolean;
      maxProgress: number;
      maxHardProgress: number;
      currentProgress: number;
    };
  };
};

export type TUserStatistics = {
  userStatistics?: {
    learnedWords?: number;
    optional?: {
      [key: string]: string;
    };
  };
};

export type TQueryOptions = TUserOption &
  TWordPageOption &
  TAuthOption &
  TUserWord &
  TUserStatistics;

export interface ILoader {
  getResponse<T>({
    endpoint,
    options,
  }: {
    endpoint: TEndpoints;
    options: TQueryOptions;
  }): Promise<T | string>;
}

export interface ILoaderContructable {
  new (url: string): ILoader;
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
