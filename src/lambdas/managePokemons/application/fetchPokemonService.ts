import { FetchApi } from '../../../shared/apis/application/fetchApi';

export class FetchPokemonService {
  private readonly pokeApiBaseURL: string = process.env.POKEAPI_BASE_URL;
  private readonly fetchApi: FetchApi = new FetchApi(this.pokeApiBaseURL);

  async execute(name: string) {
    try {
      const pokemonObtained = await this.fetchApi.get(`/pokemon/${name}`);
      return {
        name: pokemonObtained.name,
        types: pokemonObtained.types,
        image: pokemonObtained.sprites.front_default,
        createdAt: new Date().toISOString(),
        stats: {
          hp: pokemonObtained.stats.find((stat: any) => stat.stat.name === 'hp')?.base_stat || 0,
          attack: pokemonObtained.stats.find((stat: any) => stat.stat.name === 'attack')?.base_stat || 0,
          defense: pokemonObtained.stats.find((stat: any) => stat.stat.name === 'defense')?.base_stat || 0,
        },
      };
    } catch (error: unknown) {
      const { message } = error as Error;
      throw new Error(`Failed to fetch Pokémon by name: ${message}`);
    }
  }
}
