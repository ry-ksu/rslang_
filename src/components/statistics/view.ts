import Chart, { ChartConfiguration } from 'chart.js/auto';
import { IUserStatistics } from '../types/types';
import ControllerStatistics from './controller';

export default class ViewStatistics {
  private controllerStatistics: ControllerStatistics;

  private component: HTMLElement;

  constructor({
    controller,
    component,
  }: {
    controller: ControllerStatistics;
    component: HTMLElement;
  }) {
    this.controllerStatistics = controller;
    this.component = component;
  }

  draw({ statistics }: { statistics: IUserStatistics }) {
    this.component.classList.add('main_statistics');
    const statisticsContainer = document.createElement('div');
    statisticsContainer.classList.add('statistics-container');
    const todayContainer = this.getTodayStatistics({ statistics });
    const longContainer = this.getLongStatistics({ statistics });
    statisticsContainer.append(todayContainer, longContainer);
    this.component.append(statisticsContainer);
  }

  private getTodayStatistics({ statistics }: { statistics: IUserStatistics }) {
    const todayContainer = document.createElement('div');
    todayContainer.classList.add('today-container');
    const { todayStatistics } = statistics.optional;
    const getRightPercentAnswers = (success: number, wrong: number) =>
      (success * 100) / (success + wrong);
    const sprintSuccessWordsPerc = getRightPercentAnswers(
      todayStatistics.sprint.successWords.length,
      todayStatistics.sprint.failWords.length
    );
    const audioGameSuccessWordsPerc = getRightPercentAnswers(
      todayStatistics.audioGame.successWords.length,
      todayStatistics.audioGame.failWords.length
    );
    todayContainer.innerHTML = `
      <h3 class="title">Статистика за сегодня</h3>
      <div class="today-tables">
        <table class="today-games">
          <tr>
            <th></th>
            <th>Спринт</th>
            <th>Аудиовызов</th>
          </tr>
          <tr>
            <td>Новых слов</td>
            <td>${todayStatistics.sprint.newWords.length}</td>
            <td>${todayStatistics.audioGame.newWords.length}</td>
          </tr>
          <tr>
            <td>Процент правильных ответов</td>
            <td>${Math.round(sprintSuccessWordsPerc)}%</td>
            <td>${Math.round(audioGameSuccessWordsPerc)}%</td>
          </tr>
          <tr>
            <td>Самая длинная серия правильных ответов</td>
            <td>${todayStatistics.sprint.rightSeries}</td>
            <td>${todayStatistics.audioGame.rightSeries}</td>
          </tr>
        </table>
        <table class="today-words">
          <tr>
            <th></th>
            <th>Слова</th>
          </tr>
          <tr>
            <td>Новых слов</td>
            <td>${
  todayStatistics.sprint.newWords.length + todayStatistics.audioGame.newWords.length
}</td>
          </tr>
          <tr>
            <td>Изученных слов</td>
            <td>${todayStatistics.learnedWords.length}</td>
          </tr>
          <tr>
            <td>Процент правильных ответов</td>
            <td>${Math.round((sprintSuccessWordsPerc + audioGameSuccessWordsPerc) / 2)}%</td>
          </tr>
        </table>
      </div>`;
    return todayContainer;
  }

  private getLongStatistics({ statistics }: { statistics: IUserStatistics }) {
    const { longStatistics } = statistics.optional;
    const longContainer = document.createElement('div');
    longContainer.classList.add('long-container');
    const title = document.createElement('h3');
    title.classList.add('title');
    title.innerText = 'Статистика за все время';

    const statCanvas = document.createElement('canvas');
    statCanvas.classList.add('stat-canvas');
    longContainer.append(title, statCanvas);

    const dates: string[] = [];
    const newWords: number[] = [];
    const learnedWords: number[] = [];

    longStatistics.days.forEach((item) => {
      dates.push(new Date(item.date).toLocaleDateString());
      newWords.push(item.newWords.length);
      learnedWords.push(item.learnedWords.length);
    });

    const data = {
      labels: dates,
      datasets: [
        {
          label: 'Новые слова',
          color: '#f79928',
          borderColor: '#f79928',
          data: newWords,
          tension: 0.1,
        },
        {
          label: 'Изученные слова',
          color: '#3a5199',
          borderColor: '#3a5199',
          data: learnedWords,
          tension: 0.1,
        },
      ],
    };

    const config: ChartConfiguration = {
      type: 'line',
      data,
      options: {
        elements: {
          point: {
            borderWidth: 5,
          },
        },
        scales: {
          y: {
            ticks: {
              precision: 0,
              color: '#ffffff',
            },
            grid: {
              color: '#d5d6d2',
            },
          },
          x: {
            ticks: {
              color: '#ffffff',
            },
            grid: {
              color: '#d5d6d2',
            },
          },
        },
        plugins: {
          legend: {
            labels: {
              color: '#ffffff',
              font: {
                size: 20,
                style: 'italic',
              },
            },
          },
        },
      },
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const chart = new Chart(statCanvas, config);
    return longContainer;
  }

  showInvitation() {
    this.component.classList.add('main_statistics');
    const statisticsContainer = document.createElement('div');
    statisticsContainer.classList.add('statistics-container');
    const invite = document.createElement('h3');
    invite.innerHTML = `<h3>Зарегистрируйтесь для отображения статистики</h3>`;
    statisticsContainer.append(invite);
    this.component.append(statisticsContainer);
  }
}
