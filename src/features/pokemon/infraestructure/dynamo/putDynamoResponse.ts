import { PutItemCommandOutput } from '@aws-sdk/client-dynamodb';

import { ValueObject } from '../../../pokemon/domain/valueObject';
import { ResponseMapper } from './responseMapper';

export class PutDynamoResponse<T> extends ValueObject<PutItemCommandOutput> {
  constructor(readonly value: PutItemCommandOutput) {
    super(value);
  }

  valueMapper(): ResponseMapper<T> {
    const { $metadata } = this.value;
    return {
      status: $metadata.httpStatusCode,
      requestId: $metadata.requestId,
    };
  }
}
