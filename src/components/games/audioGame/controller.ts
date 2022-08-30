import { IAttributes, IGamePack, IWord, IAudioGameCurrentResult } from '../../types/types';
import ViewAudioGame from './view';

export default class ControllerAudioGame {
  attributes: IAttributes;

  gamePack: IGamePack[];

  viewAudioGame: ViewAudioGame;

  currentAudioGameStatistic: IAudioGameCurrentResult;

  constructor(attributes: IAttributes) {
    this.attributes = attributes;
    this.gamePack = [];
    this.viewAudioGame = new ViewAudioGame();
    this.currentAudioGameStatistic = {
      newWords: [],
      successWords: [],
      failWords: [],
      currentSeries: 0,
      rightSeries: 0,
    };
  }

  createGamePackForAudioGame(randomDate: IWord[]) {
    this.gamePack = [];
    
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
    this.attachEvents();
    this.playSound();
  }

  attachEvents() {
    (document.querySelector('.audioGame__img') as HTMLElement).addEventListener('click', this.playSound.bind(this));
    if (document.querySelector('.audioGame__skipBtn')) {
      (document.querySelector('.audioGame__skipBtn') as HTMLElement).addEventListener('click', this.skipWord.bind(this));
    }
    if (document.querySelector('.audioGame__skipBtn_continue')) {
      (document.querySelector('.audioGame__skipBtn_continue') as HTMLElement).addEventListener('click', this.drawAudioGamePg.bind(this));
    }
  }

  detachEvents() {
    (document.querySelector('.audioGame__img') as HTMLElement).removeEventListener('click', this.playSound.bind(this));

    if (document.querySelector('.audioGame__skipBtn')) {
      (document.querySelector('.audioGame__skipBtn') as HTMLElement).removeEventListener('click', this.skipWord.bind(this));
    }
    if (document.querySelector('.audioGame__skipBtn_continue')) {
      (document.querySelector('.audioGame__skipBtn_continue') as HTMLElement).removeEventListener('click', this.drawAudioGamePg.bind(this));
    }
  }

  skipWord() {
    if (document.querySelector('.audioGame__skipBtn')) {
      this.detachEvents();

      this.currentAudioGameStatistic.currentSeries = 0;
      this.currentAudioGameStatistic.failWords.push({
        enWord: this.gamePack[0].enRightWord,
        ruWord: this.gamePack[0].ruRightWord,
        sound: this.gamePack[0].enSound,
      });

      (document.querySelector('.audioGame__answer') as HTMLElement).innerHTML = `${this.gamePack[0].enRightWord}`;
      (document.querySelector('.audioGame__skipBtn') as HTMLElement).innerHTML = '→';

      const img = (document.querySelector('.audioGame__img') as HTMLElement).style;
      img.background = `url(${this.attributes.baseURL}/${this.gamePack[0].img}) center / contain no-repeat`;

      (document.querySelector('.audioGame__words') as HTMLElement).className = 'audioGame__words_disable';
      (document.querySelector('.right ') as HTMLElement).classList.add('audioGame__mistake');
      (document.querySelector('.audioGame__skipBtn ') as HTMLElement).className = 'primary-button audioGame__skipBtn_continue';

      this.attachEvents();
    }
  }

  drawAudioGamePg() {
    this.gamePack.shift();
    this.viewAudioGame.draw(this.gamePack[0], this.attributes);
    this.playSound();
    this.attachEvents();
  }

  playSound() {
    const audio = document.createElement('audio');
    audio.innerHTML = `<source src='${this.attributes.baseURL}/${this.gamePack[0].enSound}'>`;
    audio.setAttribute('autoplay', '');

    if (document.querySelector('audio')) {
      (document.querySelector('audio') as HTMLMediaElement).remove();
    }

    document.body.append(audio);
  }
}
