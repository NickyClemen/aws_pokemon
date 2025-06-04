import { Event, Context } from 'aws-lambda';

import { FetchPokemonService } from './application/fetchPokemonService';
import { PutPokemonService } from './application/putPokemonService';
import { ManagePokemonsController } from './infraestructure/managePokemonController';

import { Pokemon } from '../../contexts/pokemon/domain/pokemon';
import { PokemonService } from '../../contexts/pokemon/application/pokemonService';

import { IRepository } from '../../shared/aws/domain/repository';
import { DynamoClientWrapper } from '../../shared/aws/infraestructure/dynamoClient';
import { DynamoRepository } from '../../shared/aws/infraestructure/dynamoRepository';

const dynamoClient: DynamoClientWrapper = new DynamoClientWrapper();
const pokemonRepository: IRepository<Pokemon> = new DynamoRepository<Pokemon>(
  dynamoClient,
  process.env.POKEMON_TABLE_NAME,
);

const fetchPokemonService: FetchPokemonService = new FetchPokemonService();
const pokemonService: PokemonService = new PokemonService(pokemonRepository);
const putPokemonsService: PutPokemonService = new PutPokemonService(
  pokemonService,
);

export async function managePokemons(event: Event, context: Context) {
  const managePokemonsController = new ManagePokemonsController(
    event,
    fetchPokemonService,
    putPokemonsService,
  );

  return await managePokemonsController.execute();
}
