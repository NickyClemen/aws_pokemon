import { APIGatewayProxyEvent } from 'aws-lambda';
import { Logger } from '@aws-lambda-powertools/logger';

import { FetchPokemonService } from '../../../../useCases/fetchPokemon.service';
import { PutPokemonService } from '../../../../useCases/putPokemon.service';
import { IPokemon } from '../../../../domain/pokemon';
import { StatusResponse } from '../statusResponse';
import { Exception } from '../../../exceptions/exception';
import { ExceptionBuilder } from '../../../exceptionBuilder';

export class ManagePokemonsController {
  constructor(
    private readonly event: APIGatewayProxyEvent,
    private readonly logger: Logger,
    private readonly fetchPokemonService: FetchPokemonService,
    private readonly putPokemonsService: PutPokemonService,
  ) {}

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
