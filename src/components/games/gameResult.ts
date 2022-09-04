import WordsApi from '../../services/wordsAPI';
import ControllerAuthorization from '../authorization/controller';
import { cleanTodayStats, getEmptyCurrentsStatistics } from './getEmptyStatistics';
import {
  IGameCurrentResult,
  IGameCurrentResultForStats,
  ILocalStorage,
  IUserStatistics,
  IUserStatisticsGameOption,
} from '../types/types';

const dectructUserStatistics = (user: IUserStatistics): IUserStatistics => {
  const { learnedWords, optional } = user;
  const currentStats: IUserStatistics = { learnedWords, optional };
  return currentStats;
};

const getThroughSetAndMerge = (arg1: string[], arg2: string[]): string[] => {
  const arr = [...new Set(...arg1, ...arg2)];
  return arr;
};

const mergeUserTodayStatistics = (
  currentRes: IGameCurrentResultForStats,
  currentStatistics: IUserStatistics,
  gameOption: IUserStatisticsGameOption
): void => {
  currentStatistics.optional.todayStatistics[gameOption].newWords.push(
    ...getThroughSetAndMerge(
      currentRes.newWords,
      currentStatistics.optional.todayStatistics[gameOption].newWords
    )
  );
  currentStatistics.optional.todayStatistics[gameOption].successWords.push(
    ...getThroughSetAndMerge(
      currentRes.successWords,
      currentStatistics.optional.todayStatistics[gameOption].successWords
    )
  );
  currentStatistics.optional.todayStatistics[gameOption].failWords.push(
    ...getThroughSetAndMerge(
      currentRes.failWords,
      currentStatistics.optional.todayStatistics[gameOption].failWords
    )
  );
  currentStatistics.optional.todayStatistics.learnedWords.push(
    ...getThroughSetAndMerge(
      currentRes.learnedWords,
      currentStatistics.optional.todayStatistics.learnedWords
    )
  );
};

const getCurrentResult = (currentProgress: IGameCurrentResult) => {
  const currentResult = getEmptyCurrentsStatistics();
  currentProgress.successWords.forEach(word => {
    currentResult.newWords.push(word.id as string)
    currentResult.successWords.push(word.id as string)
  })
  currentProgress.failWords.forEach(word => {
    currentResult.newWords.push(word.id as string)
    currentResult.failWords.push(word.id as string)
  })
  currentResult.bestSeries = currentProgress.rightSeries;
  return currentResult;
}

export default async (
  currentProgress: IGameCurrentResult,
  api: WordsApi,
  LS: ILocalStorage,
  auth: ControllerAuthorization,
  gameOption: IUserStatisticsGameOption
): Promise<void> => {
  const date = new Date().setHours(0, 0, 0, 0);
  const currentRes = getCurrentResult(currentProgress);
  try {
    await auth.checkAuth();
    const userStatistics = await api.getUserStatistics({ userID: LS.userId, token: LS.token });
    let currentStatistics = dectructUserStatistics(userStatistics);

    currentRes.learnedWords = currentStatistics.optional.todayStatistics.learnedWords;

    const userWords = await api.getUserWords({ userID: LS.userId, token: LS.token });

    const learnedWords: string[] = userWords
      .filter((word) => word.optional.isLearned)
      .map((word) => word.wordId ?? '');
    
    if (currentStatistics.optional.todayStatistics.date === date) {
      mergeUserTodayStatistics(currentRes, currentStatistics, gameOption);
    } else {
      currentStatistics = cleanTodayStats(date, currentStatistics);
      mergeUserTodayStatistics(currentRes, currentStatistics, gameOption);
    }

    if (currentStatistics.optional.longStatistics.days.every((day) => day.date !== date)) {
      currentStatistics.optional.longStatistics.days.push({
        date,
        newWords: currentRes.newWords,

        learnedWords,
      });
    } else {
      currentStatistics.optional.longStatistics.days.forEach((day) => {
        if (day.date === date) {
          day.newWords.push(...new Set(...currentRes.newWords, ...day.newWords));
          day.learnedWords.push(...new Set(...learnedWords, ...day.learnedWords));
        }
      });
    }
    await api.updateUserStatistics({
      userID: LS.userId,
      userStatistics: currentStatistics,
      token: LS.token,
    });
  } catch (err) {
    console.log(err);
  }
};
