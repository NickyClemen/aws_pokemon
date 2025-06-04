import { DynamoDBServiceException } from '@aws-sdk/client-dynamodb';

import { ErrorCodes } from './errorCodes.enum';

export class DynamoClientException extends Error {
  constructor(private readonly error: DynamoDBServiceException) {
    super();
  }

  getError() {
    const { name, message, $metadata } = this.error;

    return {
      type: name,
      message,
      requestId: $metadata.requestId,
      statusCode: $metadata.httpStatusCode,
      statusName: ErrorCodes[name],
    };
  }
}
