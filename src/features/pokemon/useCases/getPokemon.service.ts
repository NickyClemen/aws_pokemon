import { PokemonService } from './pokemon.service';
import { IPokemon } from '../domain/pokemon';

export class GetPokemonService {
  constructor(private readonly pokemonService: PokemonService) {}

  async execute(pokemonData: Partial<IPokemon>) {
    const getPokemon = await this.pokemonService.getPokemon(pokemonData);

    if (getPokemon.item) {
      return getPokemon.item;
    }
  }
}
