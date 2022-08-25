export default class ViewHeader {
  drewHeader(auth: boolean) {
    (document.querySelector('body') as HTMLElement).innerHTML = '';

    const header = document.createElement('header');
    const logo = document.createElement('div');
    const nav = this.drewNav();
    const userArea = this.drewUserArea(auth);

    logo.className = 'logo';
    logo.innerHTML = '<h1>VICTORY</h1>';

    header.append(logo, nav, userArea);
    document.body.prepend(header);
  }

  drewUserArea(auth: boolean) {
    const userArea = document.createElement('div');

    userArea.className = 'user-area';

    if (auth) {
      userArea.innerHTML = '<button class="primary-button">Выйти</button>'
    } else {
      userArea.innerHTML = '<button class="primary-button">Войти</button>'
    }
    return userArea;
  }

  drewNav() {
    const nav = document.createElement('nav');
    nav.className = 'nav';
    nav.innerHTML = '<ul>' +
                      '<li class="mainPage">Главная</li>' +
                      '<li class="about">О нас</li>' +
                      '<li class="textbook">Учебник</li>' +
                      // разместить игры в выпадающем меню
                      '<li class="audioGame">Аудиовызов</li>' +
                      '<li class="sprint">Спринт</li>' +
                      '<li class="statistics">Статистика</li>' +
                    '</ul>'
    return nav;
  }
}