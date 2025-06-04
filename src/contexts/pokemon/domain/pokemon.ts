type Stats = {
  hp: number;
  attack: number;
  defense: number;
};

export interface Pokemon {
  id: string;
  name: string;
  types: string[];
  image: string;
  createdAt: string;
  searchCounter: number;
  stats: Stats;
}

