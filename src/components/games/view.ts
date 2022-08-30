import LocalStorage from '../../services/store';

export default class ViewGames {
  drawLevelWindow(component: HTMLElement, LS: LocalStorage) {
    const LSPage = LS.getLS().page;
    const comp = component;
    comp.className = `main_${LSPage} main_games`;

    const main = document.createElement('div');
    main.className = `${LSPage} games`;

    if (LSPage === 'audioGame') {
      main.innerHTML = `<h3 class="games__header">Аудиовызов</h3>
      <h4 class="games__description">В игре аудиовызов вам предстоит выбрать верный перевод слова, которое вы услышите.</h4>
      <h4 class="games__description games_check-lvl">Выберите уровень сложности игры.</h4>`;
    } else {
      main.innerHTML = `<h3 class="games__header">Спринт</h3>
      <h4 class="games__description">В игре спринт вас ожидает игра на скорость.</h4>
      <h4 class="games__description">Поторопитесь! У вас есть всего лишь минута.</h4>
      <h4 class="games__description games_check-lvl">Выберите уровень сложности игры.</h4>`;
    }

    const audioGameLvl = document.createElement('div');
    audioGameLvl.className = 'games__lvls';

    const lvlCount = 6;
    for (let i = 1; i <= lvlCount; i += 1) {
      const elem = document.createElement('button');
      elem.setAttribute('data-lvl', String(i - 1));
      elem.className = `games__lvl-item`;
      elem.innerHTML = String(i);
      audioGameLvl.append(elem);
    }
    main.append(audioGameLvl);
    component.append(main);
    document.body.append(component);
  }
}
