import { PokemonService } from '../../../contexts/pokemon/application/pokemonService';
import { IPokemon } from '../../../contexts/pokemon/domain/pokemon';

export class PutPokemonService {
  constructor(private readonly pokemonService: PokemonService) {}

  async execute(pokemonData: IPokemon) {
    return await this.pokemonService.putPokemon({
      ...pokemonData,
      searchCounter: String(Number(pokemonData?.searchCounter) + 1) || '0',
    });
  }
}
