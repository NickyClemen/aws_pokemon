import { event } from '../../mocks/event.mock';

import { FetchPokemonService } from '../../../src/lambdas/managePokemons/application/fetchPokemonService';
import { PokemonService } from '../../../src/contexts/pokemon/application/pokemonService';
import { ManagePokemonsController } from '../../../src/lambdas/managePokemons/infraestructure/managePokemonController';
import { PutPokemonService } from '../../../src/lambdas/managePokemons/application/putPokemonService';
import { DynamoClientWrapper } from '../../../src/shared/aws/infraestructure/dynamoClient';
import { Pokemon } from '../../../src/contexts/pokemon/domain/pokemon';

import { DynamoRepository } from '../../../src/shared/aws/infraestructure/dynamoRepository';
import { IRepository } from '../../../src/shared/aws/domain/repository';

describe('ManagePokemonsController', () => {
  const dynamoClient: DynamoClientWrapper = new DynamoClientWrapper();
  const pokemonRepository: IRepository<Pokemon> = new DynamoRepository<Pokemon>(
    dynamoClient,
    process.env.POKEMON_TABLE,
  );

  const pokemonService = new PokemonService(pokemonRepository);

  const fetchPokemonService: FetchPokemonService = new FetchPokemonService();
  const putPokemonService: PutPokemonService = new PutPokemonService(
    pokemonService,
  );
  const managePokemonsService: ManagePokemonsController =
    new ManagePokemonsController(event, fetchPokemonService, putPokemonService);

  test('should be defined', () => {
    expect(managePokemonsService).toBeDefined();
  });

  test('should have execute function', () => {
    expect(typeof managePokemonsService.execute).toBe('function');
  });

  test('should status 200', async () => {
    const response = await managePokemonsService.execute();
    expect(response.statusCode).toBe(200);
  });

  test('should status XXX', async () => {
    delete event.pathParameters.pokemonName;
    const managePokemonsServiceWithoutPokemonName: ManagePokemonsController =
      new ManagePokemonsController(
        event,
        fetchPokemonService,
        putPokemonService,
      );
    const response = await managePokemonsServiceWithoutPokemonName.execute();

    expect(response.statusCode).toBe(200);
  });
});
