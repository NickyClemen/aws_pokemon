import { Event, Context } from 'aws-lambda';

import { GetPokemonByNameController } from './infraestructure/getPokemonByName.controller';
import { GetPokemonService } from './application/getPokemon.service';
import { PokemonService } from '../../contexts/pokemon/application/pokemonService';
import { DynamoClientWrapper } from '../../shared/aws/infraestructure/dynamoClient';
import { IRepository } from '../../shared/aws/domain/repository';
import { Pokemon } from '../../contexts/pokemon/domain/pokemon';
import { DynamoRepository } from '../../shared/aws/infraestructure/dynamoRepository';
import { LambdaClienWrapper } from '../../shared/aws/infraestructure/lambdaClient';
import { LambdaInvokerService } from './application/lambdaInvoker.service';

const lambdaClient: LambdaClienWrapper = new LambdaClienWrapper();
const dynamoClient: DynamoClientWrapper = new DynamoClientWrapper();
const pokemonRepository: IRepository<Pokemon> = new DynamoRepository<Pokemon>(
  dynamoClient,
  process.env.POKEMON_TABLE_NAME,
);

const pokemonService = new PokemonService(pokemonRepository);
const getPokemonService = new GetPokemonService(pokemonService);
const lambdaInvokerService = new LambdaInvokerService(
  lambdaClient,
  'managePokemons',
);

export async function getPokemonByName(event: Event, context: Context) {
  const getPokemonByNameController = new GetPokemonByNameController(
    event,
    getPokemonService,
    lambdaInvokerService,
  );

  return await getPokemonByNameController.execute();
}
