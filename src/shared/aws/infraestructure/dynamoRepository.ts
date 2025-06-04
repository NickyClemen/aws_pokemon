import {
  GetItemCommandOutput,
  PutItemCommandOutput,
} from '@aws-sdk/client-dynamodb';

import { DynamoClientWrapper } from './dynamoClient';

import { DynamoItem } from '../domain/dynamoItem';
import { ResponseMapper } from '../domain/responseMapper';
import { GetDynamoResponse } from '../domain/getDynamoResponse';
import { PutDynamoResponse } from '../domain/putDynamoResponse';
import { IRepository } from '../domain/repository';

export class DynamoRepository<T> implements IRepository<T> {
  constructor(
    private readonly dynamoDb: DynamoClientWrapper,
    private readonly table,
  ) {}

  async getItem(input: T): Promise<ResponseMapper<T>> {
    const getItem = new DynamoItem<T>({
      table: this.table,
      dynamoType: 'Key',
      body: { ...input },
    });

    const result: GetItemCommandOutput = await this.dynamoDb.getItem(
      getItem.valueMapper(),
    );

    const getDynamoResponse: GetDynamoResponse<T> = new GetDynamoResponse<T>(
      result,
    );

    return getDynamoResponse.valueMapper();
  }

  async putItem(input: T): Promise<ResponseMapper<T>> {
    const putItem = new DynamoItem({
      table: this.table,
      dynamoType: 'Item',
      body: { ...input },
    });

    const result: PutItemCommandOutput = await this.dynamoDb.putItem(
      putItem.valueMapper(),
    );

    const putDynamoResponse: PutDynamoResponse<T> = new PutDynamoResponse<T>(
      result,
    );
    return putDynamoResponse.valueMapper();
  }
}
