import { Event, Context } from 'aws-lambda';

import { Logger } from '@aws-lambda-powertools/logger';
import { injectLambdaContext } from '@aws-lambda-powertools/logger/middleware';

import middy from '@middy/core';

import { FetchPokemonService } from '../../../useCases/fetchPokemonService';
import { PutPokemonService } from '../../../useCases/putPokemonService';
import { ManagePokemonsController } from '../../adapters/http/controllers/managePokemon.controller';

import { IPokemon } from '../../contexts/pokemon/domain/pokemon';
import { PokemonService } from '../../contexts/pokemon/application/pokemonService';

import { IRepository } from '../../shared/aws/domain/repository';
import { DynamoClientWrapper } from '../../shared/aws/infraestructure/dynamoClient';
import { DynamoRepository } from '../../shared/aws/infraestructure/dynamoRepository';
import { PathParametersValidator } from '../../shared/apis/infraestructure/middlewares/pathParametersValidator/pathParametersValidator';

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

export async function managePokemonsHandler(event: Event, context: Context) {
  const managePokemonsController = new ManagePokemonsController(
    event,
    logger,
    fetchPokemonService,
    putPokemonsService,
  );

  return await managePokemonsController.execute();
}

export const managePokemons = middy(managePokemonsHandler)
  .use(injectLambdaContext(logger))
  .use(pathParametersValidator.execute());
