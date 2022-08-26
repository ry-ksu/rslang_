import WordsApi from '../services/wordsAPI';
import Loader from '../services/loader';
import LocalStorage from '../services/store';
import { IAttributes } from './types/types';

import ControllerAbout from './about/controller';
import ControllerAudioGame from './audioGame/controller';
// import ControllerAuthorization from './authorization/controller';
import ControllerHeader from './header/controller';
import ControllerMainPage from './mainPage/controller';
// import ControllerSprintGame from './sprintGame/controller';
// import ControllerStatistics from './statistics/controller';
// import ControllerTeamPage from './teamPage/controller';
// import ControllerTextBook from './textBook/controller';

// import { ILocalStorage } from './types/types';
import '../sass/style.scss';

class App {
  attributes: IAttributes;

  controllers: {
    about: ControllerAbout;
    audioGame: ControllerAudioGame;
    // authorization: ControllerAuthorization;
    header: ControllerHeader;
    mainPage: ControllerMainPage;
    // sprintGame: ControllerSprintGame;
    // statistics: ControllerStatistics;
    // teamPage: ControllerTeamPage;
    // textBook: ControllerTextBook
  };

  constructor() {
    this.attributes = {
      baseURL: 'https://rslang-learnwords-api.herokuapp.com',
      wordsApi: new WordsApi({LoaderService: Loader}),
      localStorage: new LocalStorage(),
      component: document.createElement('main'),
    }
    this.controllers = {
      about: new ControllerAbout(),
      audioGame: new ControllerAudioGame(),
      // authorization: new ControllerAuthorization(),
      header: new ControllerHeader(),
      mainPage: new ControllerMainPage(),
      // sprintGame: new ControllerSprintGame(),
      // statistics: new ControllerStatistics(),
      // teamPage: new ControllerTeamPage(),
      // textBook: new ControllerTextBook(),
    }
  }

  changeLSPageAndRenderThisPage(e: Event) {
    if ((e.target as HTMLElement).nodeName === 'LI') {
      this.attributes.localStorage.changeLS('page', (e.target as HTMLElement).className)

      this.render();
    }
  } 

  detachEvents(){
    // Header
    if (document.querySelector('.nav')) {
      (document.querySelector('.nav') as HTMLElement).removeEventListener('click', this.changeLSPageAndRenderThisPage.bind(this));
    }
  }

  attachEvents() {
    // Header
    if (document.querySelector('.nav')) {
      (document.querySelector('.nav') as HTMLElement).addEventListener('click', this.changeLSPageAndRenderThisPage.bind(this));
    }
  }

  render() {

    this.attributes.component.innerHTML = '';
    const LS = this.attributes.localStorage.getLS();
    
    const dictionary = {
      mainPage: (): void => {
        this.controllers.mainPage.getDate(this.attributes.component);
      },
      about: (): void => {
        this.controllers.about.getDate(this.attributes.component);
      },
    }
  
    const dictionaryPromise = {
      audioGame: async (): Promise<void> => {
        await this.controllers.audioGame.getDate(this.attributes);
      },
      // sprint: () => {
      //   this.controllers.sprintGame.getData();
      // },
      // statistics: () => {
      //   this.controllers.statistics.getData();
      // },
      // textbook: () => {
      //   this.controllers.textBook.getData();
      // },
    }
  
    this.detachEvents();
    this.controllers.header.getData(LS.token);

    if (Object.keys(LS).length === 0) {
      dictionary.mainPage();
      this.attachEvents();
    } else if (Object.keys(dictionary).includes(LS.page)) {
      dictionary[(LS.page as keyof typeof dictionary)]();
      this.attachEvents();
    } else {
      const result = dictionaryPromise[(LS.page as keyof typeof dictionaryPromise)]();
      result.then(
        () => this.attachEvents()
      ).catch(
        err => console.error(err)
      );
    }
  }
}

export default App;
