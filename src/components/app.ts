import WordsApi from '../services/wordsAPI';
import Loader from '../services/loader';
import LocalStorage from '../services/store';
import { IAttributes } from './types/types';

import ControllerAbout from './about/controller';
import ControllerAudioGame from './audioGame/controller';
import ControllerAuthorization from './authorization/controller';
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

  controllerAuthorization: ControllerAuthorization

  controllers: {
    about: ControllerAbout;
    audioGame: ControllerAudioGame;
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
      wordsApi: new WordsApi({ LoaderService: Loader }),
      localStorage: new LocalStorage(),
      component: document.createElement('main'),
      isUserAuth: false,
    };

    this.controllerAuthorization = new ControllerAuthorization(this.attributes, this.render.bind(this));

    this.controllers = {
      about: new ControllerAbout(this.attributes),
      audioGame: new ControllerAudioGame(this.attributes),
      header: new ControllerHeader(
        this.render.bind(this),
        this.attributes,
        this.changeLSPageAndRenderThisPage.bind(this),
        this.controllerAuthorization
      ),
      mainPage: new ControllerMainPage(this.attributes),
      // sprintGame: new ControllerSprintGame(),
      // statistics: new ControllerStatistics(),
      // teamPage: new ControllerTeamPage(),
      // textBook: new ControllerTextBook(),
    };
  }

  changeLSPageAndRenderThisPage(page: string) {
    // тут следует добавить остальные параметры нужные для отрисовки
    this.attributes.localStorage.changeLS('page', page);

    this.render();
  }

  render() {
    if (!document.querySelector('main')) {
      document.body.append(this.attributes.component);
    } else {
      this.attributes.component.innerHTML = '';
    }

    const LS = this.attributes.localStorage.getLS();
    const dictionary = {
      mainPage: (): void => {
        this.controllers.mainPage.getData();
      },
      about: (): void => {
        this.controllers.about.getData();
      },
      audioGame: (): void => {
        this.controllers.audioGame.getData();
      },
    };

    this.controllerAuthorization
      .checkAuth()
      .then(() => {
        this.attributes.isUserAuth = true;
      })
      .catch((err) => {
        console.log(err);
        this.attributes.isUserAuth = false;
      })
      .finally(() => {
        this.controllers.header.getData(this.attributes.isUserAuth);
        if (Object.keys(LS).length === 0 || !LS.page) {
          dictionary.mainPage();
        } else {
          dictionary[LS.page as keyof typeof dictionary]();
        }
      });
  }
}

export default App;
