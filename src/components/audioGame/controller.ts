import { IWord, IGamePack, IAttributes } from '../types/types';
import ViewAudioGame from './view';

export default class ControllerAudioGame {
  viewAudioGame: ViewAudioGame;

  gamePack: IGamePack[];

  attributes: IAttributes;

  constructor(attributes: IAttributes, gamePack = []) {
    this.attributes = attributes;
    this.gamePack = gamePack;
    this.viewAudioGame = new ViewAudioGame();
  }

  async getDate(): Promise<void> {
    
    // Нужно получать все слова, а не запрашивать их
    const date: IWord[] = await this.attributes.wordsApi.getWords({
      wordGroup: 1,
      wordPage: 1,
    });

    const randomDate = date.sort(() => Math.random() - 0.5);

    for (let i = 0; i < randomDate.length; i += 1) {
      const sound = randomDate[i].audio;
      const rightWord = randomDate[i].word;
      const wrongWords: IWord['word'][] = [];
      const wrongWordsCount = 4;

      for (let j = 0; j < wrongWordsCount; j += 1) {
        // set
        let index = Math.ceil(Math.random() * randomDate.length - 1);
        while (index === i || wrongWords.includes(randomDate[index].word)) {
          index = Math.ceil(Math.random() * randomDate.length - 1);
        }
        wrongWords.push(randomDate[index].word);
      }

      const mixWords = [...wrongWords];
      mixWords.push(rightWord);
      mixWords.sort(() => Math.random() - 0.5);

      this.gamePack.push({
        rightWord,
        sound,
        wrongWords,
        mixWords,
      })
    }
    this.viewAudioGame.draw(this.gamePack[0], this.attributes);
  }
}
