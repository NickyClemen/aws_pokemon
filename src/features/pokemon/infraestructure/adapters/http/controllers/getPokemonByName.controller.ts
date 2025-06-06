import { Event } from 'aws-lambda';

import { GetPokemonService } from '../../../../useCases/getPokemon.service';
import { IPokemon } from '../../../contexts/pokemon/domain/pokemon';
import { AwsClientException } from '../../../shared/aws/domain/exceptions/awsClient.exception';
import { DynamoClientException } from '../../../shared/aws/domain/exceptions/dynamoClient.exception';
import { LambdaInvokerService } from '../application/lambdaInvoker.service';

export class GetPokemonByNameController {
  constructor(
    private readonly event: Event,
    private readonly getPokemonsService: GetPokemonService,
    private readonly lambdaInvokerService: LambdaInvokerService,
  ) { }

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
