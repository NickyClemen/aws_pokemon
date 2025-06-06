import { Exception, ExceptionResponse } from './exception';
import { HttpCodes } from '../httpCodes';

export class HttpException extends Exception {
  constructor(
    message: string,
    private readonly statusCode: number,
  ) {
    super(message, HttpCodes[statusCode] || HttpCodes[500]);
    this.statusCode = statusCode;
  }

  getError(): ExceptionResponse {
    return {
      name: this.name,
      statusCode: this.statusCode,
      message: this.message,
    };
  }
}
