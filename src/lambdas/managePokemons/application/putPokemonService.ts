import { v4 as uuidv4 } from 'uuid';

import { PokemonService } from '../../../contexts/pokemon/application/pokemonService';
import { Pokemon } from '../../../contexts/pokemon/domain/pokemon';

export class PutPokemonService {
  constructor(private readonly pokemonService: PokemonService) {}

  async execute(pokemonData: Pokemon) {
    return await this.pokemonService.putPokemon({
      id: uuidv4(),
      searchCounter: pokemonData?.searchCounter + 1 || 0,
      ...pokemonData,
    });
  }
}
