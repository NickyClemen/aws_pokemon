import { AwsClientExceptionResponse, Exception } from './exception';
import { ErrorCodes } from './errorCodes.enum';

export class AwsClientException extends Exception {
  constructor(error: Error) {
    const { name, message } = error;
    super(message, name);
  }

  getError(): AwsClientExceptionResponse {
    return {
      type: this.name,
      message: this.message,
      statusName: ErrorCodes[this.name] ?? 'BAD_REQUEST',
      statusCode: this.name ?? 500,
    };
  }
}
