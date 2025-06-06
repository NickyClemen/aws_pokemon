import { Event, Context } from 'aws-lambda';

import { IPokemon } from '../../../domain/pokemon';

import { GetPokemonService } from '../../../useCases/getPokemon.service';
import { PokemonService } from '../../../useCases/pokemon.service';

import { GetPokemonByNameController } from '../../adapters/http/controllers/getPokemonByName.controller';
import { DynamoClientWrapper } from '../../dynamo/dynamoClientWrapper';
import { IRepository } from '../../dynamo/repository';
import { DynamoRepository } from '../../dynamo/dynamoRepository';
import { LambdaClienWrapper } from '../lambdaClientWrapper';
import { LambdaInvokerService } from '../lambdaInvoker.service';

const lambdaClient: LambdaClienWrapper = new LambdaClienWrapper();
const dynamoClient: DynamoClientWrapper = new DynamoClientWrapper();
const pokemonRepository: IRepository<IPokemon> = new DynamoRepository<IPokemon>(
  dynamoClient,
  process.env.POKEMON_TABLE_NAME,
);

const pokemonService = new PokemonService(pokemonRepository);
const getPokemonService = new GetPokemonService(pokemonService);
const lambdaInvokerService = new LambdaInvokerService(
  lambdaClient,
  'managePokemons',
);

export async function lambdaHandler(event: Event, context: Context) {
  const getPokemonByNameController = new GetPokemonByNameController(
    event,
    getPokemonService,
    lambdaInvokerService,
  );

  return await getPokemonByNameController.execute();
}
