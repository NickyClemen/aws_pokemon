import Joi from 'joi';

import { MiddlewareObj } from '@middy/core';
import { Logger } from '@aws-lambda-powertools/logger';

import { Event } from 'aws-lambda';

import { pokemonPathParametersSchema } from './schemas/pokemonPathParameters';

import { StatusResponse } from '../../../domain/statusResponse';
import { ExceptionBuilder } from '../../../domain/exceptions/exceptionBuilder';
import { Exception } from '../../../domain/exceptions/exception';
import { HttpException } from 'src/shared/apis/domain/exceptions/httpException';

export class PathParametersValidator {
  private readonly schemas: Joi.ObjectSchema<any>[] = [
    pokemonPathParametersSchema,
  ];

  constructor(private logger: Logger) { }

  execute(): MiddlewareObj<Event> {
    const before: MiddlewareObj<Event>['before'] = async (request) => {
      const { pokemonName } = request.event.pathParameters || {};
      this.logger.info('PathParametersValidator', { params: request.event.pathParameters });

      this.ifExistsPathParameters(request);
      this.validatePathParameters(request);

      request.event.pathParameters.pokemonName = pokemonName.toLowerCase();
    };

    const onError: MiddlewareObj<Event>['onError'] = async (request) => {
      const { error } = request;
      const exceptionBuilder: ExceptionBuilder = new ExceptionBuilder(
        error as Exception,
      );

      this.logger.error('ManagePokemonsController', {
        ...exceptionBuilder.buildError(),
      });

      return exceptionBuilder.buildError();
    };

    return { before, onError };
  }

  private ifExistsPathParameters(request) {
    const { pathParameters } = request.event || {};

    if (!pathParameters) {
      this.logger.error('PathParametersValidator', {
        statusCode: 422,
        body: {
          error: 'MISSING_PARAMETER',
          message: 'pokemonName is required',
        },
      });

      throw new HttpException(
        'pokemonName is required',
        422,
      );
    }
  }

  private validatePathParameters(request) {
    for (const schema of this.schemas) {
      const { error } = schema.validate(request.event.pathParameters);

      if (error) {
        this.logger.error('PathParametersValidator', {
          statusCode: 422,
          body: {
            error: 'INVALID_FORMAT',
            message: error.message,
          },
        });

        throw new HttpException(
          error.message,
          422,
        );
      }
    }
  }
}
