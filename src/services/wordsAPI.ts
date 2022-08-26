import {
  ILoader,
  ILoaderContructable,
  IWord,
  IUser,
  IUserToken,
  IUserStatistics,
  IUserWord,
} from '../components/types/types';

export class WordsApi {
  private baseUrl: string;

  private loader: ILoader;

  constructor({
    LoaderService,
    url = 'https://rslang-learnwords-api.herokuapp.com',
  }: {
    LoaderService: ILoaderContructable;
    url?: string;
  }) {
    this.baseUrl = url;
    this.loader = new LoaderService();
  }

  async getWords({
    wordGroup,
    wordPage,
  }: {
    wordGroup: number;
    wordPage: number;
  }): Promise<IWord[]> {
    const url = `${this.baseUrl}/words?group=${wordGroup}&page=${wordPage}`;
    const options: RequestInit = {
      method: 'GET',
      headers: { Accept: 'application/json' },
    };
    const result = await this.loader.makeRequest<IWord[]>({ url, options });
    return result;
  }

  async getWord({ wordID }: { wordID: string }): Promise<IWord> {
    const url = `${this.baseUrl}/words/${wordID}`;
    const options: RequestInit = {
      method: 'GET',
      headers: { Accept: 'application/json' },
    };
    const result = await this.loader.makeRequest<IWord>({ url, options });
    return result;
  }

  async createUser({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }): Promise<IUser> {
    const url = `${this.baseUrl}/users`;
    const options: RequestInit = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    };
    const result = await this.loader.makeRequest<IUser>({ url, options });
    return result;
  }

  async signUser({ email, password }: { email: string; password: string }): Promise<IUserToken> {
    const url = `${this.baseUrl}/signin`;
    const options: RequestInit = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    };
    const result = await this.loader.makeRequest<IUserToken>({ url, options });
    return result;
  }

  async getUser({ userID, token }: { userID: string; token: string }): Promise<IUser> {
    const url = `${this.baseUrl}/users/${userID}`;
    const options: RequestInit = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    };
    const result = await this.loader.makeRequest<IUser>({ url, options });
    return result;
  }

  async getNewUserToken({
    userID,
    refreshToken,
  }: {
    userID: string;
    refreshToken: string;
  }): Promise<IUserToken> {
    const url = `${this.baseUrl}/users/${userID}/tokens`;
    const options: RequestInit = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${refreshToken}`,
        Accept: 'application/json',
      },
    };
    const result = await this.loader.makeRequest<IUserToken>({ url, options });
    return result;
  }

  async createUserWord({
    userID,
    wordID,
    userWord,
    token,
  }: {
    userID: string;
    wordID: string;
    userWord: IUserWord;
    token: string;
  }): Promise<IUserWord> {
    const url = `${this.baseUrl}/users/${userID}/words/${wordID}`;
    const options: RequestInit = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userWord),
    };
    const result = await this.loader.makeRequest<IUserWord>({ url, options });
    return result;
  }

  async getUserWords({ userID, token }: { userID: string; token: string }): Promise<IUserWord[]> {
    const url = `${this.baseUrl}/users/${userID}/words`;
    const options: RequestInit = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    };
    const result = await this.loader.makeRequest<IUserWord[]>({ url, options });
    return result;
  }

  async getUserWord({
    userID,
    wordID,
    token,
  }: {
    userID: string;
    wordID: string;
    token: string;
  }): Promise<IUserWord> {
    const url = `${this.baseUrl}/users/${userID}/words/${wordID}`;
    const options: RequestInit = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    };
    const result = await this.loader.makeRequest<IUserWord>({ url, options });
    return result;
  }

  async updateUserWord({
    userID,
    wordID,
    userWord,
    token,
  }: {
    userID: string;
    wordID: string;
    userWord: IUserWord;
    token: string;
  }): Promise<IUserWord> {
    const url = `${this.baseUrl}/users/${userID}/words/${wordID}`;
    const options: RequestInit = {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userWord),
    };
    const result = await this.loader.makeRequest<IUserWord>({ url, options });
    return result;
  }

  async updateUserStatistics({
    userID,
    userStatistics,
    token,
  }: {
    userID: string;
    userStatistics: IUserStatistics;
    token: string;
  }): Promise<IUserStatistics> {
    const url = `${this.baseUrl}/users/${userID}/statistics`;
    const options: RequestInit = {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userStatistics),
    };
    const result = await this.loader.makeRequest<IUserStatistics>({ url, options });
    return result;
  }

  async getUserStatistics({
    userID,
    token,
  }: {
    userID: string;
    token: string;
  }): Promise<IUserStatistics> {
    const url = `${this.baseUrl}/users/${userID}/statistics`;
    const options: RequestInit = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    };
    const result = await this.loader.makeRequest<IUserStatistics>({ url, options });
    return result;
  }
}

export default WordsApi;
