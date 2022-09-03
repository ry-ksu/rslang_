import ControllerStatistics from "./controller";

export default class ViewStatistics {

  private controllerStatistics: ControllerStatistics;

  private component: HTMLElement;

  constructor(
    { controller, component }:
    { controller: ControllerStatistics, component: HTMLElement; }) {

    this.controllerStatistics = controller;
    this.component = component;
  }

  draw() {
    const statisticsContainer = document.createElement('div');
    statisticsContainer.classList.add('statistics-container');
    const todayContainer = this.getTodayStatistics();
    statisticsContainer.append(todayContainer);
    this.component.append(statisticsContainer);
  }

  private getTodayStatistics() {
    const todayContainer = document.createElement('div');
    todayContainer.classList.add('today-container');
    todayContainer.innerHTML = `
      <h3 class="today-title">Статистика за сегодня</h3>
      <div class="today-tables">
        <table class="today-games">
          <tr>
            <th></th>
            <th>Спринт</th>
            <th>Аудиовызов</th>
          </tr>
          <tr>
            <td>Новых слов</td>
            <td>0</td>
            <td>0</td>
          </tr>
          <tr>
            <td>Процент правильных ответов</td>
            <td>0</td>
            <td>0</td>
          </tr>
          <tr>
            <td>Самая длинная серия правильных ответов</td>
            <td>0</td>
            <td>0</td>
          </tr>
        </table>
        <table class="today-words">
          <tr>
            <th></th>
            <th>Слова</th>
          </tr>
          <tr>
            <td>Новых слов</td>
            <td>0</td>
          </tr>
          <tr>
            <td>Изученных слов</td>
            <td>0</td>
          </tr>
          <tr>
            <td>Процент правильных ответов</td>
            <td>0</td>
          </tr>
        </table>
      </div>`;
    return todayContainer;
  }

  showInvitation() {
    const invite = document.createElement('h3');
    invite.innerHTML = `<h3>Зарегистрируйтесь для отображения статистики</h3>`;
    this.component.append(invite);
  }

}
