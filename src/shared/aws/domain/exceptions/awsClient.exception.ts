import { ErrorCodes } from './errorCodes.enum';

export class AwsClientException extends Error {
  constructor(private readonly error) {
    super();
  }

  getError() {
    const { name, message } = this.error;
    return {
      type: name,
      message,
      statusName: ErrorCodes[name] ?? 'BAD_REQUEST',
      statusCode: name ?? 500,
    };
  }
}
