import { Logger } from '@aws-lambda-powertools/logger';

import { getEvent } from '../../mocks/event.mock';
import { pokemon } from '../../mocks/dynamo.mock';
import { notFound } from '../../mocks/invokeLambda.mock';

import { DynamoClientWrapper } from '../../../src/features/pokemon/infraestructure/dynamo/dynamoClientWrapper';
import { IRepository } from '../../../src/features/pokemon/infraestructure/dynamo/repository';
import { IPokemon } from '../../../src/features/pokemon/domain/pokemon';
import { PokemonService } from '../../../src/features/pokemon/useCases/pokemon.service';
import { GetPokemonService } from '../../../src/features/pokemon/useCases/getPokemon.service';
import { GetPokemonByNameController } from '../../../src/features/pokemon/infraestructure/adapters/http/controllers/getPokemonByName.controller';
import { DynamoRepository } from '../../../src/features/pokemon/infraestructure/dynamo/dynamoRepository';
import { PokemonFinderService } from '../../../src/features/pokemon/useCases/pokemonFinder.service';
import { LambdaInvokerService } from '../../../src/features/pokemon/infraestructure/lambda/lambdaInvoker.service';
import { LambdaClienWrapper } from '../../../src/features/pokemon/infraestructure/lambda/lambdaClientWrapper';

describe('GetPokemonByNameController', () => {
  const logger: Logger = new Logger();
  const lambdaClient: LambdaClienWrapper = new LambdaClienWrapper();
  const dynamoClient: DynamoClientWrapper = new DynamoClientWrapper();
  const pokemonRepository: IRepository<IPokemon> =
    new DynamoRepository<IPokemon>(dynamoClient, process.env.POKEMON_TABLE);

  const pokemonService: PokemonService = new PokemonService(pokemonRepository);
  const lambdaInvokerService: LambdaInvokerService = new LambdaInvokerService(
    lambdaClient,
    logger,
    process.env.MANAGE_POKEMONS_LAMBDA,
  );

  const getPokemonNameService: GetPokemonService = new GetPokemonService(
    pokemonService,
  );

  const pokemonFinderService: PokemonFinderService = new PokemonFinderService(
    getPokemonNameService,
    lambdaInvokerService,
  );

  const getPokemonByNameController: GetPokemonByNameController =
    new GetPokemonByNameController(getEvent, logger, pokemonFinderService);

  test('should be defined', () => {
    expect(getPokemonByNameController).toBeDefined();
  });

  test('should have execute function', () => {
    expect(typeof getPokemonByNameController.execute).toBe('function');
  });

  test('should status 200 if pokemon exists', async () => {
    jest
      .spyOn(DynamoRepository.prototype, 'getItem')
      .mockImplementation(async () => ({
        status: 200,
        requestId: 'b3ab2331-f170-4366-b0d1-9920fb8bf5de',
        item: pokemon,
      }));

    const { statusCode, body } = await getPokemonByNameController.execute();

    expect(statusCode).toBe(200);
    expect(JSON.parse(body)).toEqual(pokemon);
  });

  test('should status 201 if invoke lambda', async () => {
    jest
      .spyOn(DynamoRepository.prototype, 'getItem')
      .mockImplementation(async () => ({
        status: 200,
        requestId: 'b3ab2331-f170-4366-b0d1-9920fb8bf5de',
        item: {},
      }));

    jest
      .spyOn(LambdaInvokerService.prototype, 'execute')
      .mockImplementation(async () => ({
        statusCode: 201,
        body: JSON.stringify(pokemon),
      }));

    const { statusCode, body } = await getPokemonByNameController.execute();

    expect(statusCode).toBe(201);
    expect(JSON.parse(body)).toEqual(pokemon);
  });

  test('should status 404 if pokemon does not exist', async () => {
    jest
      .spyOn(DynamoRepository.prototype, 'getItem')
      .mockImplementation(async () => ({
        status: 200,
        requestId: 'b3ab2331-f170-4366-b0d1-9920fb8bf5de',
        item: {},
      }));

    jest
      .spyOn(LambdaInvokerService.prototype, 'execute')
      .mockImplementation(async () => ({
        statusCode: 404,
        body: JSON.stringify(notFound),
      }));

    const { statusCode, body } = await getPokemonByNameController.execute();

    expect(statusCode).toBe(404);
    expect(JSON.parse(body)).toEqual(notFound);
  });
});
