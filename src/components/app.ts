import WordsApi from '../services/wordsAPI';
import Loader from '../services/loader';
import LocalStorage from '../services/store';
import { IAttributes } from './types/types';

import ControllerAbout from './about/controller';
import ControllerGames from './games/controller';
import ControllerAuthorization from './authorization/controller';
import ControllerHeader from './header/controller';
import ControllerLoader from './loader/controller';
import ControllerMainPage from './mainPage/controller';
import ControllerFooter from './footer/controller';
// import ControllerStatistics from './statistics/controller';
import ControllerTextBook from './textBook/controller';

import '../sass/style.scss';

export class App {
  attributes: IAttributes;

  controllerAuthorization: ControllerAuthorization;

  controllerLoader: ControllerLoader;

  controllers: {
    about: ControllerAbout;
    footer: ControllerFooter;
    games: ControllerGames;
    header: ControllerHeader;
    mainPage: ControllerMainPage;
    // statistics: ControllerStatistics;
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

    this.controllerLoader = new ControllerLoader();

    this.controllers = {
      about: new ControllerAbout(this.attributes),
      footer: new ControllerFooter(),
      games: new ControllerGames(
        this,
        this.attributes,
        this.controllerAuthorization,
        this.controllerLoader
      ),
      header: new ControllerHeader(
        this.render.bind(this),
        this.attributes,
        this.changeLSPageAndRenderThisPage.bind(this),
        this.controllerAuthorization
      ),
      mainPage: new ControllerMainPage(this.attributes),
      // statistics: new ControllerStatistics(),
      textBook: new ControllerTextBook(this),
    };
  }

  changeLSPageAndRenderThisPage(page: string) {
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

    if (!document.querySelector('.loader')) {
      this.controllerLoader.getData();
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
        this.controllers.footer.getData();
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
