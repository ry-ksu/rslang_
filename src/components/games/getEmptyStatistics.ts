import { IGameCurrentResultForStats, IUserStatistics } from '../types/types';

export default (date: number): IUserStatistics => ({
  learnedWords: 0,
  optional: {
    todayStatistics: {
      date,
      learnedWords: [],
      audioGame: {
        newWords: [],
        successWords: [],
        failWords: [],
        rightSeries: 0,
      },
      sprint: {
        newWords: [],
        successWords: [],
        failWords: [],
        rightSeries: 0,
      },
    },
    longStatistics: {
      days: [
        {
          date,
          newWords: [],
          learnedWords: [],
        },
      ],
    },
  },
});

export const getEmptyCurrentsStatistics = (): IGameCurrentResultForStats => ({
  learnedWords: [],
  newWords: [],
  successWords: [],
  failWords: [],
  bestSeries: 0,
});

export const cleanTodayStats = (date: number, stats: IUserStatistics): IUserStatistics => {
  const { optional, learnedWords } = stats;
  const newStats = { learnedWords, optional }
  newStats.optional.todayStatistics.date = date;
  newStats.optional.todayStatistics.learnedWords = [];

  newStats.optional.todayStatistics.audioGame.newWords = [];
  newStats.optional.todayStatistics.audioGame.successWords = [];
  newStats.optional.todayStatistics.audioGame.failWords = [];
  newStats.optional.todayStatistics.audioGame.rightSeries = 0;

  newStats.optional.todayStatistics.sprint.newWords = [];
  newStats.optional.todayStatistics.sprint.successWords = [];
  newStats.optional.todayStatistics.sprint.failWords = [];
  newStats.optional.todayStatistics.sprint.rightSeries = 0;
  return newStats;
};
