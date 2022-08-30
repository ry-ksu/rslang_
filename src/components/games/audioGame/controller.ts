import { IAttributes, IGamePack, IWord } from '../../types/types';
import ViewAudioGame from './view';

export default class ControllerAudioGame {
  attributes: IAttributes;

  gamePack: IGamePack[];

  viewAudioGame: ViewAudioGame;

  constructor(attributes: IAttributes) {
    this.attributes = attributes;
    this.gamePack = [];
    this.viewAudioGame = new ViewAudioGame();
  }

  createGamePackForAudioGame(randomDate: IWord[]) {
    for (let i = 0; i < randomDate.length; i += 1) {
      const enSound = randomDate[i].audio;
      const enRightWord = randomDate[i].word;
      const ruRightWord = randomDate[i].wordTranslate;
      const img = randomDate[i].image;
      const ruWrongWordsArray: IWord['word'][] = [];
      const ruWrongWordsCount = 4;

      for (let j = 0; j < ruWrongWordsCount; j += 1) {
        let index = Math.ceil(Math.random() * randomDate.length - 1);
        while (index === i || ruWrongWordsArray.includes(randomDate[index].wordTranslate)) {
          index = Math.ceil(Math.random() * randomDate.length - 1);
        }
        ruWrongWordsArray.push(randomDate[index].wordTranslate);
      }

      const ruMixWords = [...ruWrongWordsArray];
      ruMixWords.push(ruRightWord);
      ruMixWords.sort(() => Math.random() - 0.5);

      this.gamePack.push({
        img,
        enRightWord,
        enSound,
        ruRightWord,
        ruMixWords,
      });
    }
    this.viewAudioGame.draw(this.gamePack[0], this.attributes);
    this.gamePack.shift();
  }
}
