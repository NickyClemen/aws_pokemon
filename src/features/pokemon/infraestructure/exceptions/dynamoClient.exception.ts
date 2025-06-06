import { DynamoDBServiceException } from '@aws-sdk/client-dynamodb';

import { ErrorCodes } from './errorCodes.enum';
import { DynamoClientExceptionResponse, Exception } from './exception';

export class DynamoClientException extends Exception {
  private readonly metadata;

  constructor(error: DynamoDBServiceException) {
    const { name, message } = error;
    super(message, name);
    this.metadata = error.$metadata;
  }

  getError(): DynamoClientExceptionResponse {
    return {
      type: this.name,
      message: this.message,
      requestId: this.metadata.requestId,
      statusCode: this.metadata.httpStatusCode,
      statusName: ErrorCodes[this.name],
    };
  }
}
