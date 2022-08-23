import { ILoader } from '../components/types/types';

export class Loader implements ILoader {
  async makeRequest<T>({
    url,
    options,
  }: {
    url: string;
    options?: RequestInit;
  }): Promise<T | string> {
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw response;
      return response.json() as Promise<T>;
    } catch (result) {
      if (result instanceof Response) {
        return Promise.reject(result);
      }
      throw new Error((result as Error).message);
    }
  }
}

export default Loader;
