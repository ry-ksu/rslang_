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
  const unique: Set<string> = new Set();
  arg1.forEach((word) => unique.add(word));
  arg2.forEach((word) => unique.add(word));
  return [...unique];
};

const mergeUserTodayStatistics = (
  currentRes: IGameCurrentResultForStats,
  currentStatistics: IUserStatistics,
  gameOption: IUserStatisticsGameOption
): IUserStatistics => {
  const localStats = { ...currentStatistics };

  localStats.optional.todayStatistics[gameOption].newWords = [
    ...getThroughSetAndMerge(
      currentRes.newWords,
      currentStatistics.optional.todayStatistics[gameOption].newWords
    ),
  ];

  localStats.optional.todayStatistics[gameOption].successWords = [
    ...getThroughSetAndMerge(
      currentRes.successWords,
      currentStatistics.optional.todayStatistics[gameOption].successWords
    ),
  ];
  localStats.optional.todayStatistics[gameOption].failWords = [
    ...getThroughSetAndMerge(
      currentRes.failWords,
      currentStatistics.optional.todayStatistics[gameOption].failWords
    ),
  ];

  localStats.optional.todayStatistics.learnedWords = [
    ...getThroughSetAndMerge(
      currentRes.learnedWords,
      currentStatistics.optional.todayStatistics.learnedWords
    ),
  ];
  return localStats;
};

const getCurrentResult = (currentProgress: IGameCurrentResult) => {
  const currentResult = getEmptyCurrentsStatistics();
  currentProgress.successWords.forEach((word) => {
    currentResult.newWords.push(word.id as string);
    currentResult.successWords.push(word.id as string);
  });
  currentProgress.failWords.forEach((word) => {
    currentResult.newWords.push(word.id as string);
    currentResult.failWords.push(word.id as string);
  });
  return currentResult;
};

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
    let learnedWords: string[] = userWords
      .filter((word) => word.optional.isLearned)
      .map((word) => word.wordId ?? '');

    if (currentStatistics.optional.todayStatistics.date === date) {
      currentStatistics = mergeUserTodayStatistics(currentRes, currentStatistics, gameOption);
    } else {
      currentStatistics = cleanTodayStats(date, currentStatistics);
      currentStatistics = mergeUserTodayStatistics(currentRes, currentStatistics, gameOption);
    }

    if (
      currentRes.bestSeries > currentStatistics.optional.todayStatistics[gameOption].rightSeries
    ) {
      currentStatistics.optional.todayStatistics[gameOption].rightSeries = currentRes.bestSeries;
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
          currentRes.newWords = currentRes.newWords.filter((word) => !day.newWords.includes(word));
          day.newWords.push(...currentRes.newWords);
          learnedWords = learnedWords.filter((word) => !day.learnedWords.includes(word));
          day.learnedWords.push(...learnedWords);
        }
      });
    }
    const res = await api.updateUserStatistics({
      userID: LS.userId,
      userStatistics: currentStatistics,
      token: LS.token,
    });
    console.log(res);
  } catch (err) {
    console.log(err);
  }
};
