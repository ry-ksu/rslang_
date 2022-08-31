import { IAttributes, IGamePack, IWord, IAudioGameCurrentResult } from '../../types/types';
import ViewAudioGame from './view';
import App from '../../app';

export default class ControllerAudioGame {
  app: App;

  attributes: IAttributes;

  gamePack: IGamePack[];

  viewAudioGame: ViewAudioGame;

  currentAudioGameStatistic: IAudioGameCurrentResult;

  constructor(app: App, attributes: IAttributes) {
    this.app = app;
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
    if (document.querySelector('.audioGame__words')) {
      (document.querySelector('.audioGame__words') as HTMLElement).addEventListener('click', this.changeWord.bind(this));
    }
  }

  attachStatisticEvents() {
    (document.querySelector('.audioGame__statistic') as HTMLElement).addEventListener('click', this.playSound.bind(this));
    (document.querySelector('.audioGame__mainPgBtn') as HTMLElement).addEventListener('click', this.goToMainPage.bind(this));
    (document.querySelector('.audioGame__btn-continue') as HTMLElement).addEventListener('click', this.goToAudioGame.bind(this));
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

  goToAudioGame() {
    this.app.render();
  }

  goToMainPage() {
    this.attributes.localStorage.changeLS('page', 'mainPage');
    this.app.render();
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

    this.currentAudioGameStatistic.currentSeries += 1;
    if (this.currentAudioGameStatistic.rightSeries < this.currentAudioGameStatistic.currentSeries) {
      this.currentAudioGameStatistic.rightSeries = this.currentAudioGameStatistic.currentSeries;
    }

    this.currentAudioGameStatistic.newWords.push(this.gamePack[0].enRightWord);
    this.currentAudioGameStatistic.successWords.push({
      enWord: this.gamePack[0].enRightWord,
      ruWord: this.gamePack[0].ruRightWord,
      sound: this.gamePack[0].enSound,
    });
  }

  addMistakeInStatistic() {
    this.detachEvents();

    this.currentAudioGameStatistic.currentSeries = 0;
    this.currentAudioGameStatistic.failWords.push({
      enWord: this.gamePack[0].enRightWord,
      ruWord: this.gamePack[0].ruRightWord,
      sound: this.gamePack[0].enSound,
    });
  }

  addRightAnswerInWindow() {
    (document.querySelector('.audioGame__answer') as HTMLElement).innerHTML = `${this.gamePack[0].enRightWord}`;
    (document.querySelector('.audioGame__skipBtn') as HTMLElement).innerHTML = '→';

    const img = (document.querySelector('.audioGame__img') as HTMLElement).style;
    img.background = `url(${this.attributes.baseURL}/${this.gamePack[0].img}) center / contain no-repeat`;

    (document.querySelector('.audioGame__words') as HTMLElement).className = 'audioGame__words_disable';
    (document.querySelector('.right ') as HTMLElement).classList.add('audioGame__right-answer');
    (document.querySelector('.audioGame__skipBtn ') as HTMLElement).className = 'primary-button audioGame__skipBtn_continue';

    this.attachEvents();
  }

  drawAudioGamePg() {
    this.gamePack.shift();

    if (this.gamePack.length !== 0) {
      this.viewAudioGame.draw(this.gamePack[0], this.attributes);
      this.playSound();
      this.attachEvents();
    } else {
      this.viewAudioGame.drawResults(this.currentAudioGameStatistic, this.attributes.component);
      this.attachStatisticEvents();
    }
  }

  playSound(e?: Event) {
    if (e && !((e.target as HTMLElement).classList.contains('word__img'))) {
      return;
    }

    const audio = document.createElement('audio');

    if (e && (e.target as HTMLElement).classList.contains('word__img')) {
      const index = Number((e.target as HTMLElement).classList[0]);
      const group = ((((e .target as HTMLElement).parentElement as HTMLElement).parentElement as HTMLElement).className);
      if (group === 'audioGame__wrongWords') {
        audio.innerHTML = `<source src='${this.attributes.baseURL}/${this.currentAudioGameStatistic.failWords[index].sound}'>`
      } else {
        audio.innerHTML = `<source src='${this.attributes.baseURL}/${this.currentAudioGameStatistic.successWords[index].sound}'>`
      }

    } else {
      audio.innerHTML = `<source src='${this.attributes.baseURL}/${this.gamePack[0].enSound}'>`;
    }

    audio.setAttribute('autoplay', '');

    if (document.querySelector('audio')) {
      (document.querySelector('audio') as HTMLMediaElement).remove();
    }

    document.body.append(audio);
  }
}
