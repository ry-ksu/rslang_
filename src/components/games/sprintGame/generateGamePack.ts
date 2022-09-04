import { IWord } from '../../types/types';

export type GamePackValue = {
  id: string;
  word: string;
  translation: string;
  correct: boolean;
  sound: string;
  correctTranslation: string;
};

export type GamePack = Map<number, GamePackValue>;

export const getRandomInt = (max: number): number => Math.floor(Math.random() * max);

export const setMapProperty = (
  map: GamePack,
  index: number,
  id: string,
  word: string,
  translation: string,
  flag: boolean,
  sound: string,
  correctTranslation: string
) => {
  if (flag) {
    map.set(index, {
      id,
      word,
      translation,
      correct: flag,
      sound,
      correctTranslation,
    });
  } else {
    map.set(index, {
      id,
      word,
      translation,
      correct: flag,
      sound,
      correctTranslation,
    });
  }
};

export const getGamePack = (data: IWord[]): GamePack => {
  const words = [...data];
  const gamePack: GamePack = new Map();
  let index = 0;
  while (gamePack.size < data.length) {
    let randomIndex = getRandomInt(data.length);
    const word = words.pop() as IWord;

    if (randomIndex % 2 === 0) {
      setMapProperty(
        gamePack,
        index,
        word.id,
        word.word,
        word.wordTranslate,
        true,
        word.audio,
        word.wordTranslate
      );
    } else {
      if (data[randomIndex].word === word.word) {
        while (data[randomIndex].word !== word.word) {
          randomIndex = getRandomInt(data.length);
        }
      }
      setMapProperty(
        gamePack,
        index,
        word.id,
        word.word,
        data[randomIndex].wordTranslate,
        false,
        word.audio,
        word.wordTranslate
      );
    }
    index += 1;
  }
  return gamePack;
};
