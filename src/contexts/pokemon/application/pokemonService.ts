import { IPokemon } from '../domain/pokemon';

import { IRepository } from '../../../shared/aws/domain/repository';

export class PokemonService {
  constructor(private readonly repository: IRepository<IPokemon>) {
    this.repository = repository;
  }

  async getPokemon(pokemon: Partial<IPokemon>) {
    return await this.repository.getItem({ ...pokemon });
  }

  async putPokemon(pokemon: IPokemon) {
    return await this.repository.putItem({ ...pokemon });
  }
}
