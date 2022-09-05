import { IAttributes, IGamePack, IWord, IGameCurrentResult, IUserWord } from '../../types/types';
import ViewAudioGame from './view';
import ControllerGames from '../controller';
import ViewGames from '../view';
import updateUserWord from '../userWordActions';
import ControllerAuthorization from '../../authorization/controller';
import sendResult from '../gameResult';

export default class ControllerAudioGame {
  controllerGames: ControllerGames;

  attributes: IAttributes;

  gameObjects: {
    gamePack: IGamePack[];
    currentAudioGameStatistic: IGameCurrentResult;
  };

  authorization: ControllerAuthorization;

  userWords: IUserWord[] = [];

  isAuth = false;

  view: {
    viewGames: ViewGames;
    viewAudioGame: ViewAudioGame;
  };

  constructor(
    controllerGames: ControllerGames, 
    viewGames: ViewGames, 
    attributes: IAttributes, 
    authorization: ControllerAuthorization
  ) {
    this.controllerGames = controllerGames;
    this.attributes = attributes;
    this.authorization = authorization;
    this.gameObjects = {
      gamePack: [],
      currentAudioGameStatistic: {
        newWords: [],
        successWords: [],
        failWords: [],
        currentSeries: 0,
        rightSeries: 0,
      },
    };
    this.view = {
      viewGames,
      viewAudioGame: new ViewAudioGame(),
    };
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

    this.getUserWords()
      .then((userWords) => { this.userWords = userWords })
      .catch(() => console.log('cant get user words'))

    for (let i = 0; i < randomDate.length; i += 1) {
      const enSound = randomDate[i].audio;
      const enRightWord = randomDate[i].word;
      const ruRightWord = randomDate[i].wordTranslate;
      const img = randomDate[i].image;
      const ruWrongWordsArray: IWord['word'][] = [];
      const ruWrongWordsCount = 4;
      const wordId = randomDate[i].id;

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
        wordId
      });
    }
    this.view.viewAudioGame.draw(this.gameObjects.gamePack[0], this.attributes);
    this.attachEvents();
    this.playSound();
  }

  attachEvents() {
    (document.querySelector('.audioGame__img') as HTMLElement).addEventListener(
      'click',
      this.playSound.bind(this)
    );
    if (document.querySelector('.audioGame__skipBtn')) {
      (document.querySelector('.audioGame__skipBtn') as HTMLElement).addEventListener(
        'click',
        this.skipWordHandler.bind(this)
      );
    }
    if (document.querySelector('.audioGame__skipBtn_continue')) {
      (document.querySelector('.audioGame__skipBtn_continue') as HTMLElement).addEventListener(
        'click',
        this.drawAudioGamePg.bind(this)
      );
    }
    if (document.querySelector('.audioGame__words')) {
      (document.querySelector('.audioGame__words') as HTMLElement).addEventListener(
        'click',
        this.changeWord.bind(this)
      );
    }
    document.addEventListener('keyup', this.handleKeyUp);
  }

  detachEvents() {
    (document.querySelector('.audioGame__img') as HTMLElement).removeEventListener(
      'click',
      this.playSound.bind(this)
    );

    if (document.querySelector('.audioGame__skipBtn')) {
      (document.querySelector('.audioGame__skipBtn') as HTMLElement).removeEventListener(
        'click',
        this.skipWordHandler.bind(this)
      );
    }
    if (document.querySelector('.audioGame__skipBtn_continue')) {
      (document.querySelector('.audioGame__skipBtn_continue') as HTMLElement).removeEventListener(
        'click',
        this.drawAudioGamePg.bind(this)
      );
    }
    if (document.querySelector('.audioGame__words')) {
      (document.querySelector('.audioGame__words') as HTMLElement).removeEventListener(
        'click',
        this.changeWord.bind(this)
      );
    }
    document.removeEventListener('keyup', this.handleKeyUp);
  }

  handleKeyUp = (e: KeyboardEvent) => {
    if (document.querySelector('.audioGame__answer')) {
      if ((document.querySelector('.audioGame__answer') as HTMLElement).innerHTML === '') {
        if (e.key === '1' || e.key === '2' || e.key === '3' || e.key === '4' || e.key === '5') {
          this.defineWord(document.querySelector(`.word_${Number(e.key) - 1}`) as HTMLElement);
        }
      }

      if (e.code === 'Space') {
        if (
          document.querySelector('.audioGame__answer') &&
          document.querySelector('.audioGame__skipBtn_continue')
        ) {
          this.drawAudioGamePg();
        } else {
          this.skipWordHandler();
        }
      }
    }
  };

  skipWordHandler() {
    this.skipWord();
    (document.querySelector('.right ') as HTMLElement).style.background = '#e2a6a6';
  }

  changeWord(e: Event) {
    if ((document.querySelector('.audioGame__answer') as HTMLElement).innerHTML === '') {
      this.defineWord(e.target as HTMLElement);
    }
  }

  defineWord(elem: HTMLElement) {
    if (elem.classList.contains('right')) {
      this.addRightAnswerInStatistic();
      this.addRightAnswerInWindow();
    } else if (elem.classList.contains('wrong')) {
      this.skipWord();
      const el = elem;
      el.style.background = '#e2a6a6';
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
    if (
      this.gameObjects.currentAudioGameStatistic.rightSeries <
      this.gameObjects.currentAudioGameStatistic.currentSeries
    ) {
      this.gameObjects.currentAudioGameStatistic.rightSeries =
        this.gameObjects.currentAudioGameStatistic.currentSeries;
    }

    this.gameObjects.currentAudioGameStatistic.newWords.push(
      this.gameObjects.gamePack[0].enRightWord
    );
    this.gameObjects.currentAudioGameStatistic.successWords.push({
      enWord: this.gameObjects.gamePack[0].enRightWord,
      ruWord: this.gameObjects.gamePack[0].ruRightWord,
      sound: this.gameObjects.gamePack[0].enSound,
      id: this.gameObjects.gamePack[0].wordId
    });
    this.updateUserWord();
  }

  addMistakeInStatistic() {
    this.detachEvents();

    this.gameObjects.currentAudioGameStatistic.newWords.push(
      this.gameObjects.gamePack[0].enRightWord
    );

    this.gameObjects.currentAudioGameStatistic.currentSeries = 0;
    this.gameObjects.currentAudioGameStatistic.failWords.push({
      enWord: this.gameObjects.gamePack[0].enRightWord,
      ruWord: this.gameObjects.gamePack[0].ruRightWord,
      sound: this.gameObjects.gamePack[0].enSound,
      id: this.gameObjects.gamePack[0].wordId
    });
    this.updateUserWord();
  }

  updateUserWord() {
    if (this.isAuth) {
      if (this.gameObjects.gamePack.length !== 0) {
        const LS = this.attributes.localStorage.getLS();
        updateUserWord(
          this.userWords,
          LS.userId, 
          this.gameObjects.gamePack[0].wordId, 
          LS.token, 
          this.attributes.wordsApi, 
          'success')
          .catch(() => { throw new Error })
      }
    }
  }

  addRightAnswerInWindow() {
    (
      document.querySelector('.audioGame__answer') as HTMLElement
    ).innerHTML = `${this.gameObjects.gamePack[0].enRightWord}`;
    (document.querySelector('.audioGame__skipBtn') as HTMLElement).innerHTML = '(Пробел) →';

    const img = (document.querySelector('.audioGame__img') as HTMLElement).style;
    img.background = `url(${this.attributes.baseURL}/${this.gameObjects.gamePack[0].img}) center / contain no-repeat`;

    (document.querySelector('.audioGame__words') as HTMLElement).className =
      'audioGame__words_disable';
    (document.querySelector('.right ') as HTMLElement).classList.add('audioGame__right-answer');
    (document.querySelector('.audioGame__skipBtn ') as HTMLElement).className =
      'primary-button audioGame__skipBtn_continue';

    this.attachEvents();
  }

  async getUserWords() {
    const LS = this.attributes.localStorage.getLS();
    const userWords = await this.attributes.wordsApi.getUserWords({ userID: LS.userId, token: LS.token });
    return userWords;
  }

  drawAudioGamePg() {
    this.gameObjects.gamePack.shift();

    this.authorization.checkAuth()
      .then(() => { this.isAuth = true })
      .catch(() => console.log());

    if (this.gameObjects.gamePack.length !== 0) {
      this.view.viewAudioGame.draw(this.gameObjects.gamePack[0], this.attributes);
      this.playSound();
      this.attachEvents();
    } else {
      this.detachEvents();
      this.view.viewGames.drawResults(
        this.gameObjects.currentAudioGameStatistic,
        this.attributes.component
      );
      this.controllerGames.attachStatisticEvents(this.gameObjects.currentAudioGameStatistic);
      const LS = this.attributes.localStorage.getLS();
      sendResult(
        this.gameObjects.currentAudioGameStatistic,
        this.attributes.wordsApi,
        LS,
        this.authorization,
        'audioGame',
        this.userWords
      )
        .catch(() => console.log('Cant send result'))
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
