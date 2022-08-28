export default class ViewHeader {
  drawHeader(auth: boolean) {
    if (document.querySelector('header')) {
      (document.querySelector('header') as HTMLElement).remove();
    }

    const header = document.createElement('header');
    const logo = document.createElement('div');
    const nav = this.drawNav();
    const userArea = this.drawUserArea(auth);

    logo.className = 'logo';
    logo.innerHTML = '<h1>VICTORY</h1>';

    header.append(logo, nav, userArea);
    document.body.prepend(header);
  }

  drawUserArea(auth: boolean) {
    const userArea = document.createElement('div');

    userArea.className = 'user-area';

    if (auth) {
      userArea.innerHTML = '<button class="primary-button" data-logout>Выйти</button>';
    } else {
      userArea.innerHTML = '<button class="primary-button" data-login>Войти</button>';
    }
    return userArea;
  }

  drawNav() {
    const nav = document.createElement('nav');
    nav.className = 'nav';
    // тут data-атрибуты лучше, чем матчится на css-классы
    nav.innerHTML =
      '<ul>' +
      '<li data-page="mainPage">Главная</li>' +
      '<li data-page="about">О нас</li>' +
      '<li data-page="textbook">Учебник</li>' +
      // разместить игры в выпадающем меню
      '<li data-page="audioGame">Аудиовызов</li>' +
      '<li data-page="sprint">Спринт</li>' +
      '<li data-page="statistics">Статистика</li>' +
      '</ul>';
    return nav;
  }
}
