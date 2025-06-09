import { PokemonService } from './pokemon.service';
import { IPokemon } from '../domain/pokemon';

export class PutPokemonService {
  constructor(private readonly pokemonService: PokemonService) {}

  async execute(pokemonData: IPokemon) {
    return await this.pokemonService.putPokemon({
      ...pokemonData,
    });
  }
}
