import {
  DynamoDBClient,
  DynamoDBServiceException,
  GetItemCommand,
  GetItemCommandOutput,
  PutItemCommand,
  PutItemCommandOutput,
} from '@aws-sdk/client-dynamodb';

import { DynamoClientException } from '../exceptions/dynamoClient.exception';
import { AwsClientException } from '../exceptions/awsClient.exception';
import { Exception } from '../exceptions/exception';

export class DynamoClientWrapper {
  private readonly isTest = process.env.JEST_WORKER_ID;
  private readonly dynamoClient: DynamoDBClient = new DynamoDBClient({
    region: process.env.REGION,
    ...(this.isTest && {
      endpoint: process.env.DYNAMO_ENDPOINT,
      sslEnabled: false,
    }),
  });

  async getItem(input): Promise<GetItemCommandOutput> {
    try {
      const dynamoCommand = new GetItemCommand(input);
      return await this.dynamoClient.send(dynamoCommand);
    } catch (error: unknown) {
      if (error instanceof DynamoDBServiceException) {
        throw new DynamoClientException(error);
      }

      throw new AwsClientException(error as Exception);
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

      throw new AwsClientException(error as Exception);
    }
  }
}
