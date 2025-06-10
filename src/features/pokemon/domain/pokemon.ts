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

type Types = {
  slot: number;
  type: {
    name: string;
    url: string;
  };
};

export type PokemonProps = Omit<IPokemon, 'stats' | 'types'> & {
  rawStats: RawStats[];
  types: Types[];
};

export interface IPokemon {
  id: string;
  name: string;
  types: string[];
  image: string;
  createdAt: string;
  stats: Stats;
}

export class Pokemon implements IPokemon {
  readonly id: string;
  readonly name: string;
  readonly types: string[];
  readonly image: string;
  readonly createdAt: string;
  readonly stats: Stats;

  constructor({ id, name, types, image, createdAt, rawStats }: PokemonProps) {
    this.id = id;
    this.name = name;
    this.types = this.mapTypes(types);
    this.image = image;
    this.createdAt = createdAt;
    this.stats = this.mapStats(rawStats);
  }

  private mapTypes(types: Types[]): string[] {
    return types.map((type: Types) => type.type.name);
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
    rawStats,
  }: PokemonProps): Pokemon {
    return new Pokemon({
      id,
      name,
      types,
      image,
      createdAt,
      rawStats,
    });
  }
}
