import { APIGatewayProxyEvent, Context } from 'aws-lambda';

import { Logger } from '@aws-lambda-powertools/logger';
import { injectLambdaContext } from '@aws-lambda-powertools/logger/middleware';

import middy from '@middy/core';

import { GetPokemonByNameController } from '../../adapters/http/controllers/getPokemonByName.controller';
import { DynamoClientWrapper } from '../../dynamo/dynamoClientWrapper';
import { IRepository } from '../../dynamo/repository';
import { DynamoRepository } from '../../dynamo/dynamoRepository';
import { LambdaClienWrapper } from '../lambdaClientWrapper';
import { LambdaInvokerService } from '../lambdaInvoker.service';

import { IPokemon } from '../../../domain/pokemon';

import { GetPokemonService } from '../../../useCases/getPokemon.service';
import { PokemonService } from '../../../useCases/pokemon.service';
import { PathParametersValidator } from '../../adapters/http/middlewares/pathParameters.validator';
import { PokemonFinderService } from '../../../useCases/pokemonFinder.service';

const logger: Logger = new Logger();
const lambdaClient: LambdaClienWrapper = new LambdaClienWrapper();
const dynamoClient: DynamoClientWrapper = new DynamoClientWrapper();
const pokemonRepository: IRepository<IPokemon> = new DynamoRepository<IPokemon>(
  dynamoClient,
  process.env.POKEMON_TABLE_NAME,
);

const pokemonService: PokemonService = new PokemonService(pokemonRepository);
const getPokemonService: GetPokemonService = new GetPokemonService(
  pokemonService,
);

const lambdaInvokerService: LambdaInvokerService = new LambdaInvokerService(
  lambdaClient,
  logger,
  process.env.MANAGE_POKEMONS_LAMBDA,
);

const pokemonFinderService: PokemonFinderService = new PokemonFinderService(
  getPokemonService,
  lambdaInvokerService,
);

const pathParametersValidator = new PathParametersValidator(logger);

export async function lambdaHandler(
  event: APIGatewayProxyEvent,
  context: Context,
) {
  const getPokemonByNameController = new GetPokemonByNameController(
    event,
    logger,
    pokemonFinderService,
  );

  return await getPokemonByNameController.execute();
}

export const getPokemonByName = middy(lambdaHandler)
  .use(injectLambdaContext(logger))
  .use(pathParametersValidator.execute());
