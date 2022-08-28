export default class ViewAbout {
  drawTeamCard(
    img: string,
    name: string,
    github: string,
    role: string,
    about: string,
    work: string
  ) {
    const card = document.createElement('div');

    card.className = 'team-card';

    card.innerHTML = `<div class='team-card__img ${img}'>
                      <div class='team-card__content'>
                        <div class='team-card__main-info'>
                          <h4 class='team-card__name'>${name}</h4>
                          <a href='${github}'>
                            <div class='team-card__github-icon'></div>
                          </a>
                        </div>
                        <p class='team-card__header'>${role}</p>
                        <p class='team-card__paragraph'>${about}</p>
                        <p class='team-card__header'>Что сделали?</p>
                        <p class='team-card__paragraph'>${work}</p>
                      </div>`;
    return card;
  }

  drawTeamCards(component: HTMLElement) {
    const teamCount = 3;
    const teamImgs = ['1.png', '2.png', '3.png'];
    const teamNames = ['Ярослав', 'Ксения', 'Халид'];
    const teamGithub = [
      'https://github.com/chagins',
      'https://github.com/ry-ksu',
      'https://github.com/salladin95',
    ];
    const teamRoles = ['Team Lead', 'Developer', 'Developer'];
    const teamAbout = [
      'Я - слива лиловая, спелая, садовая!',
      'А я - абрикос на юге pос!',
      'А я томат!',
    ];
    const teamWorks = ['Сделал то-то', 'Сделала то-то', 'Сделал то-то'];

    const teamHeader = document.createElement('h3');
    teamHeader.innerHTML = 'Наша команда:';
    component.append(teamHeader);

    for (let i = 0; i < teamCount; i += 1) {
      component.append(
        this.drawTeamCard(
          teamImgs[i],
          teamNames[i],
          teamGithub[i],
          teamRoles[i],
          teamAbout[i],
          teamWorks[i]
        )
      );
    }
    document.body.append(component);
  }
}
