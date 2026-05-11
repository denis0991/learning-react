import type { Animals } from '../components/search/search.interfaces';

export const mockAnimals: Animals[] = [
  {
    uid: '1',
    name: 'Lion',
    avian: false,
    earthAnimal: true,
    feline: true,
    earthInsect: false,
    canine: false,
  },
  {
    uid: '2',
    name: 'Eagle',
    avian: true,
    earthAnimal: false,
    feline: false,
    earthInsect: false,
    canine: false,
  },
  {
    uid: '3',
    name: 'Cat',
    avian: false,
    earthAnimal: true,
    feline: true,
    earthInsect: false,
    canine: false,
  },
];
