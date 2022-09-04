import { IUserWord } from '../types/types';

export type ComparatorToUpdateUserWord = 'success' | 'failure';
export type DifficultyOption = 'weak' | 'hard';
export type UpdateWordFn = (word: IUserWord, comparator: number) => IUserWord;
