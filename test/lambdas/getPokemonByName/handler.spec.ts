import { event } from '../../mocks/event.mock';

import { GetPokemonByNameController } from '../../../src/lambdas/getPokemonByName/infraestructure/getPokemonByName.controller';
import { PokemonService } from '../../../src/features/pokemon/useCases/pokemon.service';
import { IPokemon } from '../../../src/features/pokemon/domain/pokemon';
import { GetPokemonService } from '../../../src/lambdas/getPokemonByName/application/getPokemon.service';
import { IRepository } from '../../../src/shared/aws/domain/repository';
import { DynamoClientWrapper } from '../../../src/shared/aws/infraestructure/dynamoClient';
import { DynamoRepository } from '../../../src/features/pokemon/infraestructure/dynamo/dynamoRepository';

describe('GetPokemonByNameController', () => {
  const dynamoClient: DynamoClientWrapper = new DynamoClientWrapper();
  const pokemonRepository: IRepository<IPokemon> =
    new DynamoRepository<IPokemon>(dynamoClient, process.env.POKEMON_TABLE);

  const pokemonService = new PokemonService(pokemonRepository);

  const getPokemonNameService: GetPokemonService = new GetPokemonService(
    pokemonService,
  );
  const getPokemonByNameController: GetPokemonByNameController =
    new GetPokemonByNameController(event, getPokemonNameService);

  test('should be defined', () => {
    expect(getPokemonByNameController).toBeDefined();
  });

  test('should have execute function', () => {
    expect(typeof getPokemonByNameController.execute).toBe('function');
  });

  test('should status 200', async () => {
    const response = await getPokemonByNameController.execute();
    console.log('response', response);
  });
});
