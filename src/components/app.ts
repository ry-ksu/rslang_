import WordsApi from '../services/wordsAPI';
import Loader from '../services/loader';
import LocalStorage from '../services/store';
import { IAttributes } from './types/types';

import ControllerAbout from './about/controller';
import ControllerGames from './games/controller';
import ControllerAuthorization from './authorization/controller';
import ControllerHeader from './header/controller';
import ControllerMainPage from './mainPage/controller';
import ControllerFooter from './footer/controller';
// import ControllerStatistics from './statistics/controller';
// import ControllerTeamPage from './teamPage/controller';
import ControllerTextBook from './textBook/controller';

// import { ILocalStorage } from './types/types';
import '../sass/style.scss';

export class App {
  attributes: IAttributes;

  controllerAuthorization: ControllerAuthorization;

  controllers: {
    about: ControllerAbout;
    footer: ControllerFooter;
    games: ControllerGames;
    header: ControllerHeader;
    mainPage: ControllerMainPage;
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
      isUserAuth: false,
    };

    this.controllerAuthorization = new ControllerAuthorization(
      this.attributes,
      this.render.bind(this)
    );

    this.controllers = {
      about: new ControllerAbout(this.attributes),
      footer: new ControllerFooter(),
      games: new ControllerGames(this, this.attributes),
      header: new ControllerHeader(
        this.render.bind(this),
        this.attributes,
        this.changeLSPageAndRenderThisPage.bind(this),
        this.controllerAuthorization
      ),
      mainPage: new ControllerMainPage(this.attributes),
      // statistics: new ControllerStatistics(),
      // teamPage: new ControllerTeamPage(),
      textBook: new ControllerTextBook(this),
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
      this.attributes.component.className = '';
    }

    if (document.querySelector('footer')) {
      (document.querySelector('footer') as HTMLElement).remove();
    }

    const LS = this.attributes.localStorage.getLS();
    const dictionary = {
      mainPage: (): void => {
        this.controllers.mainPage.getData();
        this.controllers.footer.getData();
      },
      about: (): void => {
        this.controllers.about.getData();
        this.controllers.footer.getData();
      },
      audioGame: (): void => {
        this.controllers.games.getData();
      },
      sprint: (): void => {
        this.controllers.games.getData();
      },
      textbook: () => {
        this.controllers.textBook.getData().catch((error) => console.error(error));
      },
    };

    this.controllerAuthorization
      .checkAuth()
      .then(() => {
        this.attributes.isUserAuth = true;
      })
      .catch(() => {
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
