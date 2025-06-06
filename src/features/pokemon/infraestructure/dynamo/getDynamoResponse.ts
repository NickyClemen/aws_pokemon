import { GetItemCommandOutput } from '@aws-sdk/client-dynamodb';
import { ValueObject } from '../../../pokemon/domain/valueObject';
import { ResponseMapper } from './responseMapper';

export class GetDynamoResponse<T> extends ValueObject<GetItemCommandOutput> {
  constructor(readonly value: GetItemCommandOutput) {
    super(value);
  }

  valueMapper(): ResponseMapper<T> {
    const { $metadata, Item = {} } = this.value;

    return {
      status: $metadata.httpStatusCode,
      requestId: $metadata.requestId,
      item: Object.entries(Item).reduce((accum, entry) => {
        const [key, value] = entry;
        accum[key] = key === 'buyer' ? JSON.parse(value.S) : value.S;
        return accum;
      }, {} as T),
    };
  }
}
