// import ControllerAudioGame from '../components/audioGame/controller';
// import ControllerAuthorization from '../components/authorization/controller';
import ControllerHeader from './header/controller';
// import ControllerSprintGame from '../components/sprintGame/controller';
// import ControllerStatistics from '../components/statistics/controller';
// import ControllerTeamPage from '../components/teamPage/controller';
// import ControllerTextBook from '../components/textBook/controller';

import ViewAbout from './about/view';
import ViewMainPage from './mainPage/view';

import { ILocalStorage } from './types/types';

class App {
  controllers: {
    // audioGame: ControllerAudioGame;
    // authorization: ControllerAuthorization;
    header: ControllerHeader;
    // sprintGame: ControllerSprintGame;
    // statistics: ControllerStatistics;
    // teamPage: ControllerTeamPage;
    // textBook: ControllerTextBook
  };

  views: {
    about: ViewAbout;
    mainPage: ViewMainPage;
  }

  constructor() {
    this.controllers = {
      // audioGame: new ControllerAudioGame(),
      // authorization: new ControllerAuthorization(),
      header: new ControllerHeader(),
      // sprintGame: new ControllerSprintGame(),
      // statistics: new ControllerStatistics(),
      // teamPage: new ControllerTeamPage(),
      // textBook: new ControllerTextBook(),
    }

    this.views = {
      about: new ViewAbout(),
      mainPage: new ViewMainPage(),
    }
  }


  // перенести в services.store
  changeLSPageAndRenderThisPage(e: Event) {
    if ((e.target as HTMLElement).nodeName === 'LI') {
      const LS = (JSON.parse(localStorage.getItem('victory') as string) || {}) as ILocalStorage;
      LS.page = (e.target as HTMLElement).className;
      localStorage.setItem('victory', JSON.stringify(LS));

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

    if (Object.keys(LS).length === 0 || LS.page === 'main-page') {
      this.controllers.header.getData(LS.token);
      this.views.mainPage.drewMain();
    } 
    else if (LS.page === 'about'){
      this.controllers.header.getData(LS.token);
      this.views.about.drewTeamCards();
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
