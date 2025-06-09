import { Logger } from '@aws-lambda-powertools/logger';
import { LambdaClienWrapper } from '../lambda/lambdaClientWrapper';

export class LambdaInvokerService {
  constructor(
    private readonly lambdaClient: LambdaClienWrapper,
    private readonly logger: Logger,
    private readonly functionName: string,
  ) {}

  async execute(input) {
    this.logger.info('LambdaInvokerService', {
      functionName: this.functionName,
      InvocationType: 'RequestResponse',
      ...input,
    });

    const { Payload } = await this.lambdaClient.send({
      FunctionName: this.functionName,
      InvocationType: 'RequestResponse',
      Payload: JSON.stringify(input),
    });

    if (Payload) {
      const response = JSON.parse(Buffer.from(Payload).toString());
      return response;
    }
  }
}
