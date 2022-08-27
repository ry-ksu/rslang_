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
  
  createGamePack(date: IWord[]) {
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

  getServerWordsData(lvl: number){
    this.attributes.wordsApi.getWords({
      wordGroup: lvl,
      wordPage: Math.ceil(Math.random() * 30),
    }).then((result: IWord[])=> this.createGamePack(result)).catch((err)=> console.log(err));
  }

  checkDataLvlAttribute(e: Event){
    if ((e.target as HTMLElement).hasAttribute('data-lvl')) {

      this.getServerWordsData(Number((e.target as HTMLElement).getAttribute('data-lvl')));
    }
  }

  attachEvents(){
    if (document.querySelector('.audioGame__lvls')) {
      (document.querySelector('.audioGame__lvls') as HTMLElement).addEventListener('click', this.checkDataLvlAttribute.bind(this));
    }
  }

  detachEvents() {
    //
  }  

  getDate(gameWords: IWord[] = []) {
    if (gameWords.length !== 0) {
      // this.getData();
    } else {
      this.viewAudioGame.drawLevelWindow(this.attributes.component);
      this.attachEvents();
    }
  }
}
