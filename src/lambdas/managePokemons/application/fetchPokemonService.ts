import {
  IPokemon,
  PokemonMapper,
  PokemonProps,
} from '../../../contexts/pokemon/domain/pokemon';
import { FetchApi } from '../../../shared/apis/application/fetchApi';

export class FetchPokemonService {
  private readonly pokeApiBaseURL: string = process.env.POKEAPI_BASE_URL;
  private readonly fetchApi: FetchApi = new FetchApi(this.pokeApiBaseURL);

  async execute(pokemonName: string): Promise<IPokemon> {
    const response = await this.fetchApi.get(`/pokemon/${pokemonName}`);
    const {
      name,
      types,
      sprites: { front_default: image },
      stats: rawStats,
    } = await response.json();

    return PokemonMapper.mapper({
      name,
      types,
      image,
      createdAt: new Date().toISOString(),
      rawStats,
    } as PokemonProps).toPrimitives();
  }
}
