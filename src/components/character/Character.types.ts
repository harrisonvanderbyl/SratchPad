export type Appearence = {
  image?: string;
  height: number;
  weight: number;
  gender: string;
  age: number;
  race: string;
  eyes: string;
  hair: string;
};

export type History = {
  ID: string;
  parentID: string | null;
  name?: string;
  description?: string;
  time?: number;
  importance?: number;
  product?: {
    [key: string]: {
      itemID: string;
      number: number;
    };
  };
};
export type Character = {
  name: string;
  description: string;

  history: { [key: string]: History };

  appearance: Appearence;
};

export type HistoryFilter = {
  searchText: string;
  parentID: string;
  importance: number | undefined;
};
