import { ILoader } from '../components/types/types';

export class Loader implements ILoader {
  async makeRequest<T>({ url, options }: { url: string; options?: RequestInit }): Promise<T> {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        return Promise.reject(response);
      }
      return response.json() as Promise<T>;
    } catch (result) {
      console.log(result);
      throw new Error((result as Error).message);
    }
  }
}

export default Loader;
