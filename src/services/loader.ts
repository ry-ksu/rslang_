import { ILoader, TEndpoints, TQueryString, TQueryOptions } from '../components/types/types';

export class Loader implements ILoader {
  private url: string;

  constructor(url: string) {
    this.url = url;
  }

  makeURL({ endpoint, options = {} }: { endpoint: TEndpoints; options?: TQueryOptions }): string {
    const checkArg = (arg: string | undefined): string => (typeof arg === 'string' ? arg : '');
    const queryStringDictinary: TQueryString = {
      getWords: `${this.url}/words`,
      getWordsPage: `${this.url}/words?group=${checkArg(options.wordGroup)}&page=${checkArg(
        options.wordPage
      )}`,
      getWord: `${this.url}/words/${checkArg(options.wordID)}`,
      newUser: `${this.url}/users`,
      getUser: `${this.url}/users/${checkArg(options.userID)}`,
      getToken: `${this.url}/users/${checkArg(options.userID)}/tokens`,
      getUserWords: `${this.url}/users/${checkArg(options.userID)}/words`,
      getUserWord: `${this.url}/users/${checkArg(options.userID)}/words/${checkArg(
        options.wordID
      )}`,
      newUserWord: `${this.url}/users/${checkArg(options.userID)}/words/${checkArg(
        options.wordID
      )}`,
      updateUserWord: `${this.url}/users/${checkArg(options.userID)}/words/${checkArg(
        options.wordID
      )}`,
      deleteUserWord: `${this.url}/users/${checkArg(options.userID)}/words/${checkArg(
        options.wordID
      )}`,
      signin: `${this.url}/signin`,
      updateUserStatistics: `${this.url}/users/${checkArg(options.userID)}/statistics`,
      getUserStatistics: `${this.url}/users/${checkArg(options.userID)}/statistics`,
    };
    return queryStringDictinary[endpoint];
  }

  makeBody({ endpoint, options = {} }: { endpoint: TEndpoints; options?: TQueryOptions }) {
    const userToken = typeof options.token === 'string' ? options.token : '';
    const jsonHeader = { 'Content-Type': 'application/json' };
    const authHeader = { Authorization: `Bearer ${userToken}` };
    const queryBodyDictinary = {
      newUser: {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(options),
      },
      signin: {
        method: 'POST',
        headers: { ...jsonHeader },
        body: JSON.stringify(options),
      },
      getUser: { method: 'GET', headers: { ...authHeader } },
      getToken: { method: 'GET', headers: { ...authHeader } },
      newUserWord: {
        method: 'POST',
        headers: { ...jsonHeader, ...authHeader },
        body: JSON.stringify(options.userWord),
      },
      getUserWords: { method: 'GET', headers: { ...authHeader } },
      getUserWord: { method: 'GET', headers: { ...authHeader } },
      updateUserWord: {
        method: 'PUT',
        headers: { ...jsonHeader, ...authHeader },
        body: JSON.stringify(options.userWord),
      },
      deleteUserWord: { method: 'DELETE', headers: { ...authHeader } },
      updateUserStatistics: {
        method: 'PUT',
        headers: { ...jsonHeader, ...authHeader },
        body: JSON.stringify(options.userStatistics),
      },
      getUserStatistics: { method: 'GET', headers: { ...authHeader } },
    };

    if (Object.getOwnPropertyNames(queryBodyDictinary).includes(endpoint))
      return queryBodyDictinary[endpoint as keyof typeof queryBodyDictinary];
    return undefined;
  }

  async getResponse<T>({
    endpoint,
    options,
  }: {
    endpoint: TEndpoints;
    options: TQueryOptions;
  }): Promise<T | string> {
    try {
      const connectionString = this.makeURL({ endpoint, options });
      const queryBody = this.makeBody({ endpoint, options });
      const response = await fetch(connectionString, queryBody);
      if (!response.ok) throw response;
      return response.json() as Promise<T>;
    } catch (result) {
      if (result instanceof Response) {
        console.log(result);
        return `${result.status}`;
      }
      console.error(result);
      return (result as Error).message;
    }
  }
}

export default Loader;
