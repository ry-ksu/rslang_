export default class ViewMainPage {
  drewHeader(auth: boolean, name?: string) {
    (document.querySelector('body') as HTMLElement).innerHTML = '';

    const header = document.createElement('header');
    const logo = document.createElement('div');
    const nav = this.drewNav();
    const userArea = this.drewUserArea(auth, name);

    logo.className = 'logo';
    logo.innerHTML = '<h1>VICTORY</h1>';

    header.append(logo, nav, userArea);
    document.body.prepend(header);
    
  }

  drewUserArea(auth: boolean, name?: string) {
    const userArea = document.createElement('div');

    userArea.className = 'user-area';

    if (auth && name) {
      userArea.innerHTML = `<p>Добрый день, ${name}!</p>
                            <button>Log out</button>`
    } else if (auth) {
      userArea.innerHTML = '<p>Добро пожаловать!</p>' +
                            '<button>Log out</button>';
    } else {
      userArea.innerHTML = '<p>Будем рады познакомиться!</p>' +
                           '<button>Sing in</button>' +
                           '<button>Log in</button>'
    }
    return userArea;
  }

  drewNav() {
    const nav = document.createElement('nav');

    nav.className = 'nav';

    nav.innerHTML = '<ul>' +
                      '<li class="main-page">Главная</li>' +
                      '<li class="about">О нас</li>' +
                      '<li class="textbook">Учебник</li>' +
                      // разместить игры в выпадающем меню
                      '<li class="audio-game">Аудиовызов</li>' +
                      '<li class="sprint">Спринт</li>' +
                      '<li class="statistics">Статистика</li>' +
                    '</ul>'
    return nav;
  }
}
