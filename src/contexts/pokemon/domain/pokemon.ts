import { v4 as uuidv4 } from 'uuid';

type RawStats = {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
};

type Stats = {
  hp: number;
  attack: number;
  defense: number;
};

export type PokemonProps = Omit<IPokemon, 'stats'> & { rawStats: RawStats[] };

export interface IPokemon {
  id: string;
  name: string;
  types: string[];
  image: string;
  createdAt: string;
  searchCounter: string;
  stats: Stats;
}

class Pokemon implements IPokemon {
  readonly id: string;
  readonly name: string;
  readonly types: string[];
  readonly image: string;
  readonly createdAt: string;
  readonly searchCounter: string;
  readonly stats: Stats;

  constructor({
    id,
    name,
    types,
    image,
    createdAt,
    searchCounter,
    rawStats,
  }: PokemonProps) {
    this.id = id;
    this.name = name;
    this.types = types;
    this.image = image;
    this.createdAt = createdAt;
    this.searchCounter = searchCounter;
    this.stats = this.mapStats(rawStats);
  }

  private mapStats(rawStats: RawStats[]): Stats {
    return {
      hp: rawStats.find((stat: any) => stat.stat.name === 'hp')?.base_stat || 0,
      attack:
        rawStats.find((stat: any) => stat.stat.name === 'attack')?.base_stat ||
        0,
      defense:
        rawStats.find((stat: any) => stat.stat.name === 'defense')?.base_stat ||
        0,
    } as Stats;
  }

  toPrimitives(): IPokemon {
    return {
      id: this.id,
      name: this.name,
      types: this.types,
      image: this.image,
      createdAt: this.createdAt,
      searchCounter: this.searchCounter,
      stats: this.stats,
    };
  }
}

export class PokemonMapper {
  static mapper({
    id = uuidv4(),
    name,
    types,
    image,
    createdAt,
    searchCounter = '0',
    rawStats,
  }: PokemonProps): Pokemon {
    return new Pokemon({
      id,
      name,
      types,
      image,
      createdAt,
      searchCounter,
      rawStats,
    });
  }
}
