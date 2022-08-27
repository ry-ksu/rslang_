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
      userArea.innerHTML = '<button class="auth-btn primary-button">Выйти</button>';
    } else {
      userArea.innerHTML = '<button class="auth-btn primary-button">Войти</button>';
    }
    return userArea;
  }

  drewNav() {
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
