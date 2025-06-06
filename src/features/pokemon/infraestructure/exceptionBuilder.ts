import { StatusResponse } from './adapters/http/statusResponse';
import { Exception } from './exceptions/exception';

export class ExceptionBuilder {
  constructor(private readonly error: Exception) {}

  buildError() {
    if (this.validationType()) {
      return StatusResponse.buildResponse({
        statusCode: this.error.getError().statusCode || 500,
        body: this.error.getError(),
      });
    }

    const { message } = this.error as Exception;
    return StatusResponse.buildResponse({
      statusCode: 500,
      body: {
        message,
      },
    });
  }

  private validationType(): boolean {
    return 'getError' in this.error;
  }
}
