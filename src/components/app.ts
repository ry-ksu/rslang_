// import ControllerAudioGame from '../components/audioGame/controller';
// import ControllerAuthorization from '../components/authorization/controller';
import ControllerMainPage from './mainPage/controller';
// import ControllerSprintGame from '../components/sprintGame/controller';
// import ControllerStatistics from '../components/statistics/controller';
// import ControllerTeamPage from '../components/teamPage/controller';
// import ControllerTextBook from '../components/textBook/controller';

type ILocalStorage = {
  token?: string;
  name?: string;
  page?: string;
  groupTB?: number;
  pageTB?: number;
};

class App {
  controllers: {
    // audioGame: ControllerAudioGame;
    // authorization: ControllerAuthorization;
    mainPage: ControllerMainPage;
    // sprintGame: ControllerSprintGame;
    // statistics: ControllerStatistics;
    // teamPage: ControllerTeamPage;
    // textBook: ControllerTextBook
  };

  constructor() {
    this.controllers = {
      // audioGame: new ControllerAudioGame(),
      // authorization: new ControllerAuthorization(),
      mainPage: new ControllerMainPage(),
      // sprintGame: new ControllerSprintGame(),
      // statistics: new ControllerStatistics(),
      // teamPage: new ControllerTeamPage(),
      // textBook: new ControllerTextBook(),
    }
    this.changeLSPageAndRenderThisPage = this.changeLSPageAndRenderThisPage.bind(this);
  }

  changeLSPageAndRenderThisPage(e: Event) {
    if ((e.target as HTMLElement).nodeName === 'LI') {
      const LS = (JSON.parse(localStorage.getItem('victory') as string) || {}) as ILocalStorage;
      LS.page = (e.target as HTMLElement).className;
      localStorage.setItem('victory', JSON.stringify(LS));

      this.render();
    }
  } 

  attachEvents() {
    if (document.querySelector('.nav')) {
      (document.querySelector('.nav') as HTMLElement).addEventListener('click', this.changeLSPageAndRenderThisPage);
    }
  }

  render() {
    const LS = (JSON.parse(localStorage.getItem('victory') as string) || {}) as ILocalStorage;
    if (LS && LS.page === 'main-page') {
      this.controllers.mainPage.getData(LS.token, LS.name);
    } 
    // else if (LS && LS.page === 'audio-game'){
    //   this.controllers.textBook.getData();
    // }
    // else if (LS && LS.page === 'sprint'){
    //   this.controllers.textBook.getData();
    // }
    // else if (LS && LS.page === 'textbook'){
    //   this.controllers.textBook.getData();
    // }
    this.attachEvents();
  }
}

export default App;
