import WordsApi from '../../services/wordsAPI';
import { IUserWord } from '../types/types';
import { DifficultyOption, UpdateWordFn } from './contracts';

const getNewUserWord = (): IUserWord => ({
  difficulty: 'weak',
  optional: {
    isLearned: false,
    currentProgress: 0,
    rightAnswerCount: 0,
    wrongAnswerCount: 0,
  },
});

const updateGuessedWordFn: UpdateWordFn = (word: IUserWord, comparator: number): IUserWord => {
  // чтобы было можно редактировать, копирую слово
  const localWord = { ...word };

  if (localWord.optional.currentProgress === comparator) {
    localWord.optional.isLearned = true;
    localWord.optional.currentProgress = 0;
    localWord.optional.rightAnswerCount += 1;
  } else {
    localWord.optional.currentProgress += 1;
    localWord.optional.rightAnswerCount += 1;
  }
  return localWord;
};

const updateGussedWordByOption = (word: IUserWord, weakMaxProgress = 3, hardMaxProgress = 5) => {
  const updateWordByOption: Record<DifficultyOption, () => IUserWord> = {
    weak: (): IUserWord => updateGuessedWordFn(word, weakMaxProgress),
    hard: (): IUserWord => updateGuessedWordFn(word, hardMaxProgress),
  };
  return updateWordByOption[word.difficulty as DifficultyOption]();
};

const updateUngussedWord = (word: IUserWord): IUserWord => {
  // чтобы было можно редактировать, копирую слово
  const localWord = { ...word };
  localWord.optional.currentProgress = 0;
  localWord.optional.wrongAnswerCount += 1;
  if (localWord.optional.isLearned) {
    localWord.optional.isLearned = false;
  }
  return localWord;
};

export default async (
  userWords: IUserWord[],
  userID: string,
  wordID: string,
  token: string,
  api: WordsApi,
  condition: 'success' | 'failure'
): Promise<void> => {
  let userWord: IUserWord = getNewUserWord();
  let localUserWords: IUserWord[] = [];

  if (userWords.length > 0) {
    localUserWords = userWords.filter((word) => word.wordId === wordID);
  }
  if (localUserWords.length > 0) {
    const [localUserWord] = localUserWords;
    const { optional, difficulty } = localUserWord;
    userWord = { optional, difficulty };
  } else {
    const { optional, difficulty } = await api.createUserWord({ userID, wordID, userWord, token });
    userWord = { optional, difficulty };
  }

  let renewedWord: IUserWord;
  if (condition === 'success') {
    renewedWord = updateGussedWordByOption(userWord);
  } else {
    renewedWord = updateUngussedWord(userWord);
  }
  await api.updateUserWord({ userID, wordID, userWord: renewedWord, token });
};
