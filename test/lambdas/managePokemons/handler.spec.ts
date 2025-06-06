import { event } from '../../mocks/event.mock';

import { FetchPokemonService } from '../../../src/lambdas/managePokemons/application/fetchPokemonService';
import { PokemonService } from '../../../src/features/pokemon/useCases/pokemonService';
import { ManagePokemonsController } from '../../../src/lambdas/managePokemons/infraestructure/managePokemonController';
import { PutPokemonService } from '../../../src/lambdas/managePokemons/application/putPokemonService';
import { DynamoClientWrapper } from '../../../src/shared/aws/infraestructure/dynamoClient';
import { IPokemon } from '../../../src/features/pokemon/domain/pokemon';

import { DynamoRepository } from '../../../src/features/pokemon/infraestructure/dynamo/dynamoRepository';
import { IRepository } from '../../../src/shared/aws/domain/repository';

describe('ManagePokemonsController', () => {
  const dynamoClient: DynamoClientWrapper = new DynamoClientWrapper();
  const pokemonRepository: IRepository<IPokemon> =
    new DynamoRepository<IPokemon>(dynamoClient, process.env.POKEMON_TABLE);

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
