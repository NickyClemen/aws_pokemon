import { HttpException } from '../domain/exceptions/httpException';

export class FetchApi {
  constructor(private readonly baseURL: string) {}

  async get(path: string): Promise<Response> {
    try {
      const response: Response = await fetch(`${this.baseURL}${path}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      this.validateStatusCode(response);
      return await response;
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        throw error;
      }

      const { message } = error as Error;
      throw new Error(message);
    }
  }

  private validateStatusCode(response: Response) {
    if (response.status < 200 || response.status >= 300) {
      throw new HttpException(response.statusText, response.status);
    }
  }
}
