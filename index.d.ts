export interface PetPhoto {
  "@size": "pnt" | "fpm" | "x" | "pn" | "t";
  value: string;
}

export interface PetMedia {
  photos: {
    photo?: PetPhoto[];
  };
}

export interface Pet {
  id: string;
  name: string;
  breeds: {
    breed: string[] | string;
  };
  animal: string;
  contact: {
    city: string;
    state: string;
  };
  media: PetMedia;
  description: string;
}

export interface PetResponse {
  petfinder: {
    pet?: Pet;
  };
}

export interface PetFindResponse {
  petfinder: {
    pets?: {
      pet?: Pet | Pet[];
    };
  };
}

interface RequestOptions {
  output: string;
  animal?: string;
  breed?: string;
  location: string;
}

interface BreedResponse {
  petfinder: {
    breeds?: {
      breed?: string | string[];
    };
  };
}

type PetfinderClient = {
  pet: {
    find: (options: RequestOptions) => Promise<PetFindResponse>;
    get: (options: { id: string; output: string }) => Promise<PetResponse>;
  };
  breed: {
    list: (options: { animal: string }) => Promise<BreedResponse>;
  };
};

export const ANIMALS: string[];

export default function(options: {
  key: string;
  secret: string;
}): PetfinderClient;
