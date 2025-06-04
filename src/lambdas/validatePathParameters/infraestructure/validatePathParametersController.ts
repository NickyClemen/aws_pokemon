import { Event } from 'aws-lambda';
import Joi from 'joi';

export class ValidatePathParametersController {
  private validationErrors: string[] = [];

  constructor(
    private readonly event: Event,
    private readonly schemas: Joi.ObjectSchema<any>[],
  ) {}

  execute() {
    return this.ifExistsPathParameters().validatePathParameters().response();
  }

  private ifExistsPathParameters() {
    const { pathParameters } = this.event;
    const condition: boolean =
      !pathParameters || typeof pathParameters === 'undefined';

    if (condition) {
      this.validationErrors.push('Path parameters are required');
    }

    return this;
  }

  private validatePathParameters() {
    for (const schema of this.schemas) {
      const { error } = schema.validate(this.event.pathParameters);

      if (error) {
        this.validationErrors.push(error.message);
      }
    }

    return this;
  }

  private response() {
    if (this.validationErrors.length > 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ errors: this.validationErrors }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Path parameters are valid' }),
    };
  }
}
