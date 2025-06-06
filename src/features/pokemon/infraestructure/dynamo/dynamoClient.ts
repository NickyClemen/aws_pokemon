import {
  DynamoDBClient,
  DynamoDBServiceException,
  GetItemCommand,
  GetItemCommandOutput,
  PutItemCommand,
  PutItemCommandOutput,
} from '@aws-sdk/client-dynamodb';

import { DynamoClientException } from '../domain/exceptions/dynamoClient.exception';
import { AwsClientException } from '../domain/exceptions/awsClient.exception';

export class DynamoClientWrapper {
  private readonly isTest = process.env.JEST_WORKER_ID;
  private readonly dynamoClient: DynamoDBClient = new DynamoDBClient({
    ...(this.isTest && {
      endpoint: 'localhost:8000',
      sslEnabled: false,
      region: 'local-env',
    }),
    region: process.env.REGION,
  });

  async getItem(input): Promise<GetItemCommandOutput> {
    try {
      const dynamoCommand = new GetItemCommand(input);
      return await this.dynamoClient.send(dynamoCommand);
    } catch (error: unknown) {
      if (error instanceof DynamoDBServiceException) {
        throw new DynamoClientException(error);
      }

      throw new AwsClientException(error);
    }
  }

  async putItem(input): Promise<PutItemCommandOutput> {
    try {
      const command: PutItemCommand = new PutItemCommand(input);
      return await this.dynamoClient.send(command);
    } catch (error: unknown) {
      if (error instanceof DynamoDBServiceException) {
        throw new DynamoClientException(error);
      }

      throw new AwsClientException(error);
    }
  }
}
