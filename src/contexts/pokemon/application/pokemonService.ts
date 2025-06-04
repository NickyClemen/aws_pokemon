import { Pokemon } from '../domain/pokemon';

import { IRepository } from '../../../shared/aws/domain/repository';

export class PokemonService {
  constructor(private readonly repository: IRepository<Pokemon>) {
    this.repository = repository;
  }

  async getPokemon(pokemon: Partial<Pokemon>) {
    return await this.repository.getItem({ ...pokemon });
  }

  async putPokemon(pokemon: Pokemon) {
    return await this.repository.putItem({ ...pokemon });
  }
}
