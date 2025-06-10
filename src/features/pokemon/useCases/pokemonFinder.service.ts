import { IPokemon } from '../domain/pokemon';
import { LambdaInvokerService } from '../infraestructure/lambda/lambdaInvoker.service';

import { GetPokemonService } from './getPokemon.service';

export class PokemonFinderService {
  constructor(
    private readonly getPokemonService: GetPokemonService,
    private readonly lambdaInvokerService: LambdaInvokerService,
  ) {}

  async execute(pokemonName: string) {
    const getPokemon: IPokemon = await this.getPokemonService.execute({
      name: pokemonName,
    } as Partial<IPokemon>);

    if (this.countResultLength(getPokemon)) {
      return {
        statusCode: 200,
        body: {
          ...getPokemon,
        },
      };
    }

    const invokeLambda = await this.lambdaInvokerService.execute({
      pathParameters: {
        pokemonName,
      },
    });

    return {
      statusCode: invokeLambda.statusCode,
      body: JSON.parse(invokeLambda.body),
    };
  }

  private countResultLength(result: IPokemon): boolean {
    return Object.keys(result).length > 0;
  }
}
