import {
  InvokeCommand,
  InvokeCommandOutput,
  LambdaClient,
} from '@aws-sdk/client-lambda';

import { AwsClientException } from '../exceptions/awsClient.exception';
import { Exception } from '../exceptions/exception';

export class LambdaClienWrapper {
  private readonly lamdbaClient: LambdaClient = new LambdaClient({
    region: process.env.REGION,
  });

  send(input): Promise<InvokeCommandOutput> {
    try {
      const invokeCommand: InvokeCommand = new InvokeCommand(input);
      return this.lamdbaClient.send(invokeCommand);
    } catch (error: unknown) {
      throw new AwsClientException(error as Exception);
    }
  }
}
