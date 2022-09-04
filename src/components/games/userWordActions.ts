import WordsApi from '../../services/wordsAPI';
import { IUserWord } from '../types/types';
import { DifficultyOption, UpdateWordFn } from './contracts';

const getNewUserWord = (wordId: string): IUserWord => ({
  difficulty: 'weak',
  optional: {
    isLearned: false,
    currentProgress: 0,
    rightAnswerCount: 0,
    wrongAnswerCount: 0,
  },
  wordId,
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
  userID: string,
  wordID: string,
  token: string,
  api: WordsApi,
  condition: 'success' | 'failure'
): Promise<void> => {
  let word: IUserWord = getNewUserWord(wordID);
  console.log(word)
  console.log(wordID)
  try {
    word = await api.getUserWord({ userID, wordID, token });
    console.log(word);
  } catch {
    api.createUserWord({ userID, wordID, userWord: word, token })
      .then((resp) => { word = resp })
      .catch(() => { throw new Error('can\t create word') })
  }
  return;
  let renewedWord: IUserWord;
  if (condition === 'success') {
    renewedWord = updateGussedWordByOption(word);
  } else {
    renewedWord = updateUngussedWord(word);
  }
  await api.updateUserWord({ userID, wordID, userWord: renewedWord, token });
};
