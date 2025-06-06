import { Event } from 'aws-lambda';

import { GetPokemonService } from '../../../../useCases/getPokemon.service';
import { IPokemon } from '../../../../domain/pokemon';
import { AwsClientException } from '../../../exceptions/awsClient.exception';
import { DynamoClientException } from '../../../exceptions/dynamoClient.exception';
import { LambdaInvokerService } from '../../../lambda/lambdaInvoker.service';
import { StatusResponse } from '../statusResponse';

export class GetPokemonByNameController {
  constructor(
    private readonly event: Event,
    private readonly getPokemonsService: GetPokemonService,
    private readonly lambdaInvokerService: LambdaInvokerService,
  ) {}

  async execute() {
    try {
      const { pokemonName } = this.event.pathParameters || {};
      const getPokemon = await this.getPokemonsService.execute({
        name: pokemonName,
      } as Partial<IPokemon>);

      if (getPokemon) {
        StatusResponse.buildResponse({
          statusCode: 200,
          body: getPokemon,
        });
      }

      const invokeLambda = await this.lambdaInvokerService.execute({
        pokemonName,
      });

      StatusResponse.buildResponse({
        statusCode: 200,
        body: invokeLambda,
      });
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
