export default class ViewHeader {
  drawHeader(auth: boolean) {
    if (document.querySelector('header')) {
      (document.querySelector('header') as HTMLElement).remove();
    }

    const header = document.createElement('header');
    const headerWrapper = document.createElement('div');
    const logo = document.createElement('div');
    const nav = this.drawNav();
    const userArea = this.drawUserArea(auth);

    header.className = 'header';
    logo.className = 'logo';
    headerWrapper.className = 'header-wrapper';
    logo.innerHTML = '<h1>VICTORY</h1>';

    headerWrapper.append(logo, nav, userArea);
    header.append(headerWrapper);
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
    const nav = document.createElement('div');
    nav.className = 'header__menu';
    nav.innerHTML =
      `<div class="menu__icon">
        <span></span>
      </div>
      <nav class="menu__body">
        <ul class="menu__list">
          <li class="menu__link" data-page="mainPage">Главная</li>
          <li class="menu__link" data-page="about">О нас</li>
          <li class="menu__link" data-page="textbook">Учебник</li>
          <li class="menu__link menu__link_games" >Игры
            <ul class="menu__sub-list">
              <li class="menu__sub-link" data-page="audioGame">Аудиовызов</li>
              <li class="menu__sub-link" data-page="sprint">Спринт</li>
            </ul>
          </li>
          <li class="menu__link" data-page="statistics">Статистика</li>
        </ul>
      </nav>`
    return nav;
  }
}
