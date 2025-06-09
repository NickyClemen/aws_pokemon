import { Event } from 'aws-lambda';
import { Logger } from '@aws-lambda-powertools/logger';

import { PokemonFinderService } from '../../../../useCases/pokemonFinder.service';

import { Exception } from '../../../exceptions/exception';
import { ExceptionBuilder } from '../../../exceptionBuilder';

import { StatusResponse } from '../statusResponse';

export class GetPokemonByNameController {
  constructor(
    private readonly event: Event,
    private readonly logger: Logger,
    private readonly pokemonFinderService: PokemonFinderService,
  ) {}

  async execute() {
    try {
      const { pokemonName } = this.event.pathParameters || {};
      this.logger.info('GetPokemonByNameController', { pokemonName });

      const { statusCode, body } =
        await this.pokemonFinderService.execute(pokemonName);
      return StatusResponse.buildResponse({ statusCode, body });
    } catch (error) {
      this.logger.error('GetPokemonByNameController', {
        ...error.message,
      });
      const exceptionBuilder: ExceptionBuilder = new ExceptionBuilder(
        error as Exception,
      );

      this.logger.error('GetPokemonByNameController', {
        ...exceptionBuilder.buildError(),
      });

      return exceptionBuilder.buildError();
    }
  }
}
