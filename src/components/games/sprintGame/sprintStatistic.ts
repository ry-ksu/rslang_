type StatisticWord = {
  enWord: string;
  ruWord: string;
  sound: string;
};

export default class SprintStatistic {
  successWords: StatisticWord[] = [];

  failWords: StatisticWord[] = [];

  newWords: string[] = [];

  rightSeries = 0;

  currentSeries = 0;

  public updateNewWords(word: string) {
    this.newWords.push(word);
  }

  public updateSuccessWords(word: StatisticWord) {
    this.successWords.push(word);
  }

  public updateFailWords(word: StatisticWord) {
    this.failWords.push(word);
  }

  public updateSeries() {
    this.currentSeries += 1;
  }

  public updateBestSeries() {
    if (this.currentSeries > this.rightSeries) {
      this.rightSeries = this.currentSeries;
    }
  }
}
