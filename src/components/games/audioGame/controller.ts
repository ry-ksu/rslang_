import { IAttributes, IGamePack, IWord, IGameCurrentResult } from '../../types/types';
import ViewAudioGame from './view';
import ControllerGames from '../controller';
import ViewGames from '../view';

export default class ControllerAudioGame {
  controllerGames: ControllerGames;

  attributes: IAttributes;

  gameObjects: {
    gamePack: IGamePack[];
    currentAudioGameStatistic: IGameCurrentResult;
  }
  
  view: {
    viewGames: ViewGames;
    viewAudioGame: ViewAudioGame;
  }

  constructor(controllerGames: ControllerGames, viewGames: ViewGames, attributes: IAttributes) {
    this.controllerGames = controllerGames;
    this.attributes = attributes;
    this.gameObjects = {
      gamePack: [],
      currentAudioGameStatistic: {
        newWords: [],
        successWords: [],
        failWords: [],
        currentSeries: 0,
        rightSeries: 0,
      },
    }
    this.view = {
      viewGames,
      viewAudioGame: new ViewAudioGame(),
    }
  }

  createGamePackForAudioGame(randomDate: IWord[]) {
    this.gameObjects.currentAudioGameStatistic = {
      newWords: [],
      successWords: [],
      failWords: [],
      currentSeries: 0,
      rightSeries: 0,
    };
    this.gameObjects.gamePack = [];
    
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

      this.gameObjects.gamePack.push({
        img,
        enRightWord,
        enSound,
        ruRightWord,
        ruMixWords,
      });
    }
    this.view.viewAudioGame.draw(this.gameObjects.gamePack[0], this.attributes);
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
    if (document.querySelector('.audioGame__words')) {
      (document.querySelector('.audioGame__words') as HTMLElement).addEventListener('click', this.changeWord.bind(this));
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
    if (document.querySelector('.audioGame__words')) {
      (document.querySelector('.audioGame__words') as HTMLElement).removeEventListener('click', this.changeWord.bind(this));
    }
  }

  changeWord(e: Event){
    if ((document.querySelector('.audioGame__answer') as HTMLElement).innerHTML === '') {
      if ((e.target as HTMLElement).classList.contains('right')) {
        this.addRightAnswerInStatistic();
        this.addRightAnswerInWindow();
      } else if ((e.target as HTMLElement).classList.contains('wrong')) {
        this.skipWord();
        (e.target as HTMLElement).style.background = '#e2a6a6';
      }
    }
  }

  skipWord() {
    if (document.querySelector('.audioGame__skipBtn')) {
      this.addMistakeInStatistic();
      this.addRightAnswerInWindow();
    }
  }

  addRightAnswerInStatistic() {
    this.detachEvents();

    this.gameObjects.currentAudioGameStatistic.currentSeries += 1;
    if (this.gameObjects.currentAudioGameStatistic.rightSeries < this.gameObjects.currentAudioGameStatistic.currentSeries) {
      this.gameObjects.currentAudioGameStatistic.rightSeries = this.gameObjects.currentAudioGameStatistic.currentSeries;
    }

    this.gameObjects.currentAudioGameStatistic.newWords.push(this.gameObjects.gamePack[0].enRightWord);
    this.gameObjects.currentAudioGameStatistic.successWords.push({
      enWord: this.gameObjects.gamePack[0].enRightWord,
      ruWord: this.gameObjects.gamePack[0].ruRightWord,
      sound: this.gameObjects.gamePack[0].enSound,
    });
  }

  addMistakeInStatistic() {
    this.detachEvents();

    this.gameObjects.currentAudioGameStatistic.currentSeries = 0;
    this.gameObjects.currentAudioGameStatistic.failWords.push({
      enWord: this.gameObjects.gamePack[0].enRightWord,
      ruWord: this.gameObjects.gamePack[0].ruRightWord,
      sound: this.gameObjects.gamePack[0].enSound,
    });
  }

  addRightAnswerInWindow() {
    (document.querySelector('.audioGame__answer') as HTMLElement).innerHTML = `${this.gameObjects.gamePack[0].enRightWord}`;
    (document.querySelector('.audioGame__skipBtn') as HTMLElement).innerHTML = '→';

    const img = (document.querySelector('.audioGame__img') as HTMLElement).style;
    img.background = `url(${this.attributes.baseURL}/${this.gameObjects.gamePack[0].img}) center / contain no-repeat`;

    (document.querySelector('.audioGame__words') as HTMLElement).className = 'audioGame__words_disable';
    (document.querySelector('.right ') as HTMLElement).classList.add('audioGame__right-answer');
    (document.querySelector('.audioGame__skipBtn ') as HTMLElement).className = 'primary-button audioGame__skipBtn_continue';

    this.attachEvents();
  }

  drawAudioGamePg() {
    this.gameObjects.gamePack.shift();

    if (this.gameObjects.gamePack.length !== 0) {
      this.view.viewAudioGame.draw(this.gameObjects.gamePack[0], this.attributes);
      this.playSound();
      this.attachEvents();
    } else {
      this.view.viewGames.drawResults(this.gameObjects.currentAudioGameStatistic, this.attributes.component);
      this.controllerGames.attachStatisticEvents(this.gameObjects.currentAudioGameStatistic);
    }
  }

  playSound() {
    const audio = document.createElement('audio');

    audio.innerHTML = `<source src='${this.attributes.baseURL}/${this.gameObjects.gamePack[0].enSound}'>`;
    audio.setAttribute('autoplay', '');

    if (document.querySelector('audio')) {
      (document.querySelector('audio') as HTMLMediaElement).remove();
    }

    document.body.append(audio);
  }
}
