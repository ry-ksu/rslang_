import {
  TQueryOptions,
  ILoader,
  ILoaderContructable,
  IWord,
  IUser,
  IUserToken,
  TUserStatistics,
  TUserWord,
} from '../components/types/types';

export class WordsApi {
  private url: string;

  private loader: ILoader;

  // url = 'https://rslang-learnwords-api.herokuapp.com/'
  constructor({
    LoaderService,
    url = 'http://localhost:3002',
  }: {
    LoaderService: ILoaderContructable;
    url?: string;
  }) {
    this.url = url;
    this.loader = new LoaderService(url);
  }

  async getWords({ wordGroup, wordPage }: TQueryOptions): Promise<IWord[] | string> {
    const result = await this.loader.getResponse<IWord[]>({
      endpoint: 'getWordsPage',
      options: { wordGroup, wordPage },
    });
    return result;
  }

  async getWord({ wordID }: TQueryOptions): Promise<IWord | string> {
    const result = await this.loader.getResponse<IWord>({
      endpoint: 'getWord',
      options: { wordID },
    });
    return result;
  }

  async createUser({ name, email, password }: TQueryOptions): Promise<IUser | string> {
    const result = await this.loader.getResponse<IUser>({
      endpoint: 'newUser',
      options: { name, email, password },
    });
    return result;
  }

  async getUser({ userID, token }: TQueryOptions): Promise<IUser | string> {
    const result = await this.loader.getResponse<IUser>({
      endpoint: 'getUser',
      options: { userID, token },
    });
    return result;
  }

  async signUser({ email, password }: TQueryOptions): Promise<IUserToken | string> {
    const result = await this.loader.getResponse<IUserToken>({
      endpoint: 'signin',
      options: { email, password },
    });
    return result;
  }

  async getNewUserToken({ userID, token }: TQueryOptions): Promise<IUserToken | string> {
    const result = await this.loader.getResponse<IUserToken>({
      endpoint: 'getToken',
      options: { userID, token },
    });
    return result;
  }

  async createUserWord({
    userID,
    wordID,
    userWord,
    token,
  }: TQueryOptions): Promise<TUserWord | string> {
    const result = await this.loader.getResponse<TUserWord>({
      endpoint: 'newUserWord',
      options: { userID, wordID, userWord, token },
    });
    return result;
  }

  async getUserWords({ userID, token }: TQueryOptions): Promise<TUserWord[] | string> {
    const result = await this.loader.getResponse<TUserWord[]>({
      endpoint: 'getUserWords',
      options: { userID, token },
    });
    return result;
  }

  async getUserWord({ userID, wordID, token }: TQueryOptions): Promise<TUserWord | string> {
    const result = await this.loader.getResponse<TUserWord>({
      endpoint: 'getUserWord',
      options: { userID, wordID, token },
    });
    return result;
  }

  async updateUserWord({
    userID,
    wordID,
    userWord,
    token,
  }: TQueryOptions): Promise<TUserWord | string> {
    const result = await this.loader.getResponse<TUserWord>({
      endpoint: 'updateUserWord',
      options: { userID, wordID, userWord, token },
    });
    return result;
  }

  async updateUserStatistics({
    userID,
    userStatistics,
    token,
  }: TQueryOptions): Promise<TUserStatistics | string> {
    const result = await this.loader.getResponse<TUserStatistics>({
      endpoint: 'updateUserStatistics',
      options: { userID, userStatistics, token },
    });
    return result;
  }

  async getUserStatistics({ userID, token }: TQueryOptions): Promise<TUserStatistics | string> {
    const result = await this.loader.getResponse<TUserStatistics>({
      endpoint: 'getUserStatistics',
      options: { userID, token },
    });
    return result;
  }
}

export default WordsApi;
