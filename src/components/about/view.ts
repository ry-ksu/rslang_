export default class ViewAbout {
  drawTeamCard(
    i: number,
    name: string,
    github: string,
    role: string,
    about: string,
    work: string
  ) {
    const card = document.createElement('div');

    card.className = `team-card team-card_${i}`;

    card.innerHTML = `<div class='team-card__img team-card__img_${i}'></div>
                      <div class='team-card__content'>
                        <div class='team-card__main-info'>
                          <h4 class='team-card__name'>${name}</h4>
                          <a href='${github}'>
                            <div class='team-card__github-icon'></div>
                          </a>
                        </div>
                        <p class='team-card__header'>${role}</p>
                        <p class='team-card__paragraph'>${about}</p>
                        <p class='team-card__header'>Что сделано?</p>
                        <p class='team-card__paragraph'>${work}</p>
                      </div>`;
    return card;
  }

  drawTeamCards(component: HTMLElement) {
    const comp = component;
    const mainWrapper = document.createElement('div');
    const teamCount = 3;
    const teamNames = ['Ярослав', 'Ксения', 'Халид'];
    const teamGithub = [
      'https://github.com/chagins',
      'https://github.com/ry-ksu',
      'https://github.com/salladin95',
    ];
    const teamRoles = ['Team Lead', 'Developer', 'Developer'];
    const teamAbout = [
      'Бэкенд разработчик, который хочет начать делать красивые вещи.',
      'Менеджер проектов, который хочет руководить классами и переменными',
      'Пожарный, который хочет спасать людей от форм сделанных на дивах.',
    ];
    const teamWorks = [
      'Нэжно заставлял всех работать:) Базовая конфигурация проекта. Вся работа с бэком, включая запросы к серверу. Учебник. Массив слов для передачи в игры из учебника. Страница статистики.',
      'Хедер. Главная страница. Страница "О нас". Логика связывания компонентов сайта (App). Игра "Аудиовызов". Экран выбора уровня сложности слов для игр, экран результатов игры.',
      'Авторизация. Игра "Спринт". Обработка результатов игры и их отправка на сервер.'
    ];

    const teamHeader = document.createElement('h3');
    teamHeader.innerHTML = 'Наша команда:';
    teamHeader.className = 'about__header';
    mainWrapper.append(teamHeader);

    mainWrapper.className = 'about-wrapper';
    comp.className = 'about';

    for (let i = 0; i < teamCount; i += 1) {
      mainWrapper.append(
        this.drawTeamCard(
          i,
          teamNames[i],
          teamGithub[i],
          teamRoles[i],
          teamAbout[i],
          teamWorks[i]
        )
      );
    }
    comp.append(mainWrapper)
    document.body.append(comp);
  }
}
