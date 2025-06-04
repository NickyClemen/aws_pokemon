import { Event } from 'aws-lambda';

import { FetchPokemonService } from '../application/fetchPokemonService';
import { PutPokemonService } from '../application/putPokemonService';
import { AwsClientException } from '../../../shared/aws/domain/exceptions/awsClient.exception';
import { DynamoClientException } from '../../../shared/aws/domain/exceptions/dynamoClient.exception';

export class ManagePokemonsController {
  constructor(
    private readonly event: Event,
    private readonly fetchPokemonService: FetchPokemonService,
    private readonly putPokemonsService: PutPokemonService,
  ) {}

  async execute() {
    try {
      const { pokemonName } = this.event.pathParameters || {};
      const fetchedPokemon =
        await this.fetchPokemonService.execute(pokemonName);
      await this.putPokemonsService.execute(fetchedPokemon);

      return {
        statusCode: 201,
        body: JSON.stringify({
          fetchedPokemon,
        }),
      };
    } catch (error) {
      const validatedError: boolean =
        error instanceof AwsClientException ||
        error instanceof DynamoClientException;

      if (validatedError) {
        return {
          statusCode: error.getError().statusCode || 500,
          body: JSON.stringify(error.getError()),
        };
      }

      return {
        statusCode: 500,
        body: JSON.stringify({
          error,
        }),
      };
    }
  }
}
