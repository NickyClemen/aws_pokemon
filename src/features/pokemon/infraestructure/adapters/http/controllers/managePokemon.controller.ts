import { Event } from 'aws-lambda';

import { FetchPokemonService } from '../../../../useCases/fetchPokemonService';
import { PutPokemonService } from '../../../../useCases/putPokemonService';
import { IPokemon } from '../../../contexts/pokemon/domain/pokemon';
import { StatusResponse } from '../../../shared/apis/domain/statusResponse';
import { Exception } from '../../../../src/shared/apis/domain/exceptions/exception';
import { ExceptionBuilder } from '../../../../src/shared/apis/domain/exceptions/exceptionBuilder';
import { Logger } from '@aws-lambda-powertools/logger';

export class ManagePokemonsController {
  constructor(
    private readonly event: Event,
    private readonly logger: Logger,
    private readonly fetchPokemonService: FetchPokemonService,
    private readonly putPokemonsService: PutPokemonService,
  ) { }

  async execute() {
    try {
      const { pokemonName } = this.event.pathParameters || {};
      const fetchedPokemon: IPokemon =
        await this.fetchPokemonService.execute(pokemonName);

      this.logger.info('ManagePokemonsController', { ...fetchedPokemon });

      await this.putPokemonsService.execute(fetchedPokemon);

      return StatusResponse.buildResponse({
        statusCode: 201,
        body: {
          ...fetchedPokemon,
        },
      });
    } catch (error: unknown) {
      const exceptionBuilder: ExceptionBuilder = new ExceptionBuilder(
        error as Exception,
      );

      this.logger.error('ManagePokemonsController', {
        ...exceptionBuilder.buildError(),
      });

      return exceptionBuilder.buildError();
    }
  }
}
