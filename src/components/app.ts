import WordsApi from '../services/wordsAPI';
import Loader from '../services/loader';
import LocalStorage from '../services/store';

import ControllerAbout from './about/controller';
// import ControllerAudioGame from './audioGame/controller';
// import ControllerAuthorization from './authorization/controller';
import ControllerHeader from './header/controller';
import ControllerMainPage from './mainPage/controller';
// import ControllerSprintGame from './sprintGame/controller';
// import ControllerStatistics from './statistics/controller';
// import ControllerTeamPage from './teamPage/controller';
import ControllerTextBook from './textBook/controller';

// import { ILocalStorage } from './types/types';
import '../sass/style.scss';

class App {
  attributes: {
    baseURL: string;
    wordsApi: WordsApi;
    localStorage: LocalStorage;
    component: HTMLElement;
  };

  controllers: {
    about: ControllerAbout;
    // audioGame: ControllerAudioGame;
    // authorization: ControllerAuthorization;
    header: ControllerHeader;
    mainPage: ControllerMainPage;
    // sprintGame: ControllerSprintGame;
    // statistics: ControllerStatistics;
    // teamPage: ControllerTeamPage;
    textBook: ControllerTextBook;
  };

  constructor() {
    this.attributes = {
      baseURL: 'https://rslang-learnwords-api.herokuapp.com',
      wordsApi: new WordsApi({ LoaderService: Loader }),
      localStorage: new LocalStorage(),
      component: document.createElement('main'),
    };
    this.controllers = {
      about: new ControllerAbout(this.attributes.component),
      // audioGame: new ControllerAudioGame(this.attributes.component),
      // authorization: new ControllerAuthorization(),
      header: new ControllerHeader(),
      mainPage: new ControllerMainPage(this.attributes.component),
      // sprintGame: new ControllerSprintGame(),
      // statistics: new ControllerStatistics(),
      // teamPage: new ControllerTeamPage(),
      textBook: new ControllerTextBook(this.attributes),
    };
  }

  changeLSPageAndRenderThisPage(e: Event) {
    if ((e.target as HTMLElement).nodeName === 'LI') {
      this.attributes.localStorage.changeLS('page', (e.target as HTMLElement).className);

      this.render();
    }
  }

  detachEvents() {
    if (document.querySelector('.nav')) {
      (document.querySelector('.nav') as HTMLElement).removeEventListener(
        'click',
        this.changeLSPageAndRenderThisPage.bind(this)
      );
    }
  }

  attachEvents() {
    if (document.querySelector('.nav')) {
      (document.querySelector('.nav') as HTMLElement).addEventListener(
        'click',
        this.changeLSPageAndRenderThisPage.bind(this)
      );
    }
  }

  render() {
    this.attributes.component.innerHTML = '';
    const LS = this.attributes.localStorage.getLS();
    const dictionary = {
      mainPage: () => {
        this.controllers.header.getData(LS.token);
        this.controllers.mainPage.getData();
      },
      about: () => {
        this.controllers.header.getData(LS.token);
        this.controllers.about.getData();
      },
      // audioGame: () => {
      //   this.controllers.audioGame.getData(this.attributes);
      // },
      // sprint: () => {
      //   this.controllers.sprintGame.getData();
      // },
      // statistics: () => {
      //   this.controllers.statistics.getData();
      // },
      // textbook: () => {
      //   this.controllers.textBook.getData();
      // },
    };

    const dictionaryPromise = {
      // audioGame: async (): Promise<void> => {
      //   await this.controllers.audioGame.getDate(this.attributes);
      // },
      // sprint: () => {
      //   this.controllers.sprintGame.getData();
      // },
      // statistics: () => {
      //   this.controllers.statistics.getData();
      // },
      textbook: async () => {
        await this.controllers.textBook.getData();
      },
    };

    this.detachEvents();

    if (Object.keys(LS).length === 0) {
      dictionary.mainPage();
      this.attachEvents();
    } else if (Object.keys(dictionary).includes(LS.page)) {
      dictionary[LS.page as keyof typeof dictionary]();
      this.attachEvents();
    } else {
      const result = dictionaryPromise[LS.page as keyof typeof dictionaryPromise]();
      result.then(() => this.attachEvents()).catch((err) => console.error(err));
    }

    this.attachEvents();
  }
}

export default App;
