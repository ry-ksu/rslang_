// import { IWord, IUserStatistics } from '../types/types';
// import WordsApi from '../../services/wordsAPI';
// import LocalStorage from '../../services/store';

// export default class ControllerAudioGame {
//   component: HTMLElement;

//   audioGame: IUserStatistics['optional']['todayStatistics']['audioGame'];

//   constructor(component: HTMLElement) {
//     this.component = component;
//     this.audioGame = {
//       newWords: 0,
//       successWords: 0,
//       failWords: 0,
//       rightSeries: 0,
//     };
//   }

//   async getData(attributes: {
//     baseURL: string;
//     wordsApi: WordsApi;
//     localStorage: LocalStorage;
//     component: HTMLElement;
//   }) {

//     const date: IWord[] = await attributes.wordsApi.getWords({
//       wordGroup: 1,
//       wordPage: 1,
//     });

//     const randomDate = date.sort(() => Math.random() - 0.5);
//     const gamePack = [];
//     for (let i = 0; i < randomDate.length; i += 1) {
//       const sound = randomDate[i].audio;
//       const rightWord = randomDate[i].word;
//       const wrongWords = [];
//       const wrongWordsCount = 4;
//       for (let j = 0; j < wrongWordsCount; j += 1) {
//         // randomDate[Math.ceil(Math.random() * wrongWords.length)]
//       }
//     }
//   }
// }
