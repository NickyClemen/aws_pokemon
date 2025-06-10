import { Logger } from '@aws-lambda-powertools/logger';

import { postEvent } from '../../mocks/event.mock';
import { pokemon, putItemResponse } from '../../mocks/dynamo.mock';

import { DynamoClientWrapper } from '../../../src/features/pokemon/infraestructure/dynamo/dynamoClientWrapper';
import { IRepository } from '../../../src/features/pokemon/infraestructure/dynamo/repository';
import { IPokemon } from '../../../src/features/pokemon/domain/pokemon';
import { DynamoRepository } from '../../../src/features/pokemon/infraestructure/dynamo/dynamoRepository';
import { PokemonService } from '../../../src/features/pokemon/useCases/pokemon.service';
import { FetchPokemonService } from '../../../src/features/pokemon/useCases/fetchPokemon.service';
import { PutPokemonService } from '../../../src/features/pokemon/useCases/putPokemon.service';
import { ManagePokemonsController } from '../../../src/features/pokemon/infraestructure/adapters/http/controllers/managePokemon.controller';

describe('ManagePokemonsController', () => {
  const logger: Logger = new Logger();
  const dynamoClient: DynamoClientWrapper = new DynamoClientWrapper();
  const pokemonRepository: IRepository<IPokemon> =
    new DynamoRepository<IPokemon>(dynamoClient, process.env.POKEMON_TABLE);

  const pokemonService = new PokemonService(pokemonRepository);

  const fetchPokemonService: FetchPokemonService = new FetchPokemonService();
  const putPokemonService: PutPokemonService = new PutPokemonService(
    pokemonService,
  );

  const managePokemonsService: ManagePokemonsController =
    new ManagePokemonsController(
      postEvent,
      logger,
      fetchPokemonService,
      putPokemonService,
    );

  test('should be defined', () => {
    expect(managePokemonsService).toBeDefined();
  });

  test('should have execute function', () => {
    expect(typeof managePokemonsService.execute).toBe('function');
  });

  test('should status 200', async () => {
    jest
      .spyOn(DynamoRepository.prototype, 'putItem')
      .mockImplementation(async () => putItemResponse);

    jest
      .spyOn(FetchPokemonService.prototype, 'execute')
      .mockImplementation(async () => pokemon);

    const response = await managePokemonsService.execute();
    expect(response.statusCode).toBe(201);
  });
});
