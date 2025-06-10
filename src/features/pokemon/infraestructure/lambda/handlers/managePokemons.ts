import { APIGatewayProxyEvent, Context } from 'aws-lambda';

import { Logger } from '@aws-lambda-powertools/logger';
import { injectLambdaContext } from '@aws-lambda-powertools/logger/middleware';

import middy from '@middy/core';

import { IPokemon } from '../../../domain/pokemon';

import { FetchPokemonService } from '../../../useCases/fetchPokemon.service';
import { PutPokemonService } from '../../../useCases/putPokemon.service';
import { PokemonService } from '../../../useCases/pokemon.service';

import { ManagePokemonsController } from '../../adapters/http/controllers/managePokemon.controller';
import { PathParametersValidator } from '../../adapters/http/middlewares/pathParameters.validator';

import { IRepository } from '../../dynamo/repository';
import { DynamoClientWrapper } from '../../dynamo/dynamoClientWrapper';
import { DynamoRepository } from '../../dynamo/dynamoRepository';

const dynamoClient: DynamoClientWrapper = new DynamoClientWrapper();
const pokemonRepository: IRepository<IPokemon> = new DynamoRepository<IPokemon>(
  dynamoClient,
  process.env.POKEMON_TABLE_NAME,
);

const fetchPokemonService: FetchPokemonService = new FetchPokemonService();
const pokemonService: PokemonService = new PokemonService(pokemonRepository);
const putPokemonsService: PutPokemonService = new PutPokemonService(
  pokemonService,
);

const logger = new Logger();
const pathParametersValidator = new PathParametersValidator(logger);

export async function lambdaHandler(
  event: APIGatewayProxyEvent,
  context: Context,
) {
  const managePokemonsController = new ManagePokemonsController(
    event,
    logger,
    fetchPokemonService,
    putPokemonsService,
  );

  return await managePokemonsController.execute();
}

export const managePokemons = middy(lambdaHandler)
  .use(injectLambdaContext(logger))
  .use(pathParametersValidator.execute());
