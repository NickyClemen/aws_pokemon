import { LambdaClienWrapper } from '../lambda/lambdaClientWrapper';

export class LambdaInvokerService {
  constructor(
    private readonly lambdaClient: LambdaClienWrapper,
    private readonly functionName: string,
  ) {}

  async execute(input) {
    const { Payload } = await this.lambdaClient.send({
      FunctionName: this.functionName,
      Payload: JSON.stringify(input),
    });

    if (Payload) {
      const response = JSON.parse(Buffer.from(Payload).toString());
      return response;
    }
  }
}
