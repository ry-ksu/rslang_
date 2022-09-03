import WordsApi from '../../services/wordsAPI';
import ControllerAuthorization from '../authorization/controller';
import { cleanTodayStats } from './getEmptyStatistics';
import {
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

const mergeUserStatistics = (
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

export default async (
  currentProgress: IGameCurrentResultForStats,
  api: WordsApi,
  LS: ILocalStorage,
  auth: ControllerAuthorization,
  gameOption: IUserStatisticsGameOption
): Promise<void> => {
  const currentRes = { ...currentProgress };
  const date = new Date().setHours(0, 0, 0, 0);
  try {
    await auth.checkAuth();
    const userStatistics = await api.getUserStatistics({ userID: LS.userId, token: LS.token });
    let currentStatistics = dectructUserStatistics(userStatistics);
    if (currentStatistics.optional.todayStatistics.date === date) {
      mergeUserStatistics(currentRes, currentStatistics, gameOption);
    } else {
      currentStatistics = cleanTodayStats(date, currentStatistics);
      mergeUserStatistics(currentRes, currentStatistics, gameOption);
    }
    if (currentStatistics.optional.longStatistics.days.every((day) => day.date !== date)) {
      currentStatistics.optional.longStatistics.days.push({
        date,
        newWords: [
          ...getThroughSetAndMerge(
            currentStatistics.optional.todayStatistics.sprint.newWords,
            currentStatistics.optional.todayStatistics.audioGame.newWords
          ),
        ],

        learnedWords: [...new Set(currentStatistics.optional.todayStatistics.learnedWords)],
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
