import { HttpException } from '../domain/exceptions/httpException';

export class FetchApi {
  constructor(private readonly baseURL: string) {}

  async get(path: string) {
    try {
      const response = await fetch(`${this.baseURL}${path}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return await response.json();
    } catch (error: unknown) {
      const { message } = error as Error;
      return new HttpException(message, 500);
    }
  }
}
