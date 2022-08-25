import ControllerAbout from './about/controller';
// import ControllerAudioGame from './audioGame/controller';
// import ControllerAuthorization from './authorization/controller';
import ControllerHeader from './header/controller';
import ControllerMainPage from './mainPage/controller';
// import ControllerSprintGame from './sprintGame/controller';
// import ControllerStatistics from './statistics/controller';
// import ControllerTeamPage from './teamPage/controller';
// import ControllerTextBook from './textBook/controller';

import { ILocalStorage } from './types/types';

import LocalStorage from '../services/store';

class App {
  localStorage: LocalStorage;

  component: HTMLElement;

  controllers: {
    about: ControllerAbout;
    // audioGame: ControllerAudioGame;
    // authorization: ControllerAuthorization;
    header: ControllerHeader;
    mainPage: ControllerMainPage;
    // sprintGame: ControllerSprintGame;
    // statistics: ControllerStatistics;
    // teamPage: ControllerTeamPage;
    // textBook: ControllerTextBook
  };

  constructor() {
    this.localStorage = new LocalStorage();
    this.component = document.createElement('main');
    this.controllers = {
      about: new ControllerAbout(this.component),
      // audioGame: new ControllerAudioGame(),
      // authorization: new ControllerAuthorization(),
      header: new ControllerHeader(),
      mainPage: new ControllerMainPage(this.component),
      // sprintGame: new ControllerSprintGame(),
      // statistics: new ControllerStatistics(),
      // teamPage: new ControllerTeamPage(),
      // textBook: new ControllerTextBook(),
    }
  }

  // перенести в services.store
  changeLSPageAndRenderThisPage(e: Event) {
    if ((e.target as HTMLElement).nodeName === 'LI') {
      this.localStorage.changeLS('page', (e.target as HTMLElement).className)
      // LS.page = (e.target as HTMLElement).className;
      // localStorage.setItem('victory', JSON.stringify(LS));

      this.render();
    }
  } 

  detachEvents(){
    if (document.querySelector('.nav')) {
      (document.querySelector('.nav') as HTMLElement).removeEventListener('click', this.changeLSPageAndRenderThisPage.bind(this));
    }
  }

  attachEvents() {
    if (document.querySelector('.nav')) {
      (document.querySelector('.nav') as HTMLElement).addEventListener('click', this.changeLSPageAndRenderThisPage.bind(this));
    }
  }

  render() {
    const LS = (JSON.parse(localStorage.getItem('victory') as string) || {}) as ILocalStorage;
    this.detachEvents();
    // добавить словарь как объект (пример от Халида)

    if (Object.keys(LS).length === 0 || LS.page === 'mainPage') {
      this.controllers.header.getData(LS.token);
      this.controllers.mainPage.getData();
    } 
    else if (LS.page === 'about'){
      this.controllers.header.getData(LS.token);
      this.controllers.about.getData();
    }
    // else if (LS.page === 'audio-game'){
    //   this.controllers.audioGame.getData();
    // }
    // else if (LS.page === 'sprint'){
    //   this.controllers.sprintGame.getData();
    // }
    // else if (LS.page === 'statistics'){
    //   this.controllers.statistics.getData();
    // }
    // else if (LS.page === 'textbook'){
    //   this.controllers.textBook.getData();
    // }

    this.attachEvents();
  }
}

export default App;
