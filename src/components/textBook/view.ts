import { IWord } from "../types/types";

export default class ViewTextBook {
  container: HTMLDivElement;

  constructor(container: HTMLDivElement) {
    this.container = container;
  }

  drawCard(word: IWord) {
    const baseUrl = 'https://rslang-learnwords-api.herokuapp.com'; // temporary
    const cardWord = document.createElement('div');
    cardWord.classList.add('card-word');
    this.container.appendChild(cardWord);

    const mainWrapper = document.createElement('div');
    mainWrapper.classList.add('main-wrapper');
    cardWord.appendChild(mainWrapper);

    const pictureContainer = document.createElement('div');
    pictureContainer.classList.add('picture-container');
    const wordPicture = document.createElement('img');
    pictureContainer.appendChild(wordPicture);
    wordPicture.classList.add('word-picture');
    wordPicture.src = `${baseUrl}/${word.image}`;
    wordPicture.alt = 'word picture';
    const cardControls = document.createElement('div');
    cardControls.classList.add('card-controls');
    mainWrapper.append(pictureContainer, cardControls);

    const wordContainer = document.createElement('div');
    wordContainer.classList.add('word-container');

    const wordTranslate = document.createElement('word-translate');
    wordTranslate.classList.add('word-translate');
    wordTranslate.innerText = `${word.word} - [${word.transcription}] - ${word.wordTranslate}`;
    wordContainer.appendChild(wordTranslate);

    const sentenseContainer = document.createElement('div');
    sentenseContainer.classList.add('sentense-container');
    const textMeaning = document.createElement('p');
    textMeaning.classList.add('text-meaning');
    textMeaning.innerHTML = `<i>${word.textMeaning}</i><br>${word.textMeaningTranslate}`;
    const textExample = document.createElement('p');
    textExample.classList.add('text-example');
    textExample.innerHTML = `<i>${word.textExample}</i><br>${word.textExampleTranslate}`;
    sentenseContainer.append(textMeaning, textExample);

    const soundBtn = document.createElement('button');
    soundBtn.classList.add('sound-btn');

    const btnsContainer = document.createElement('div');
    btnsContainer.classList.add('btns-container');
    const btnHard = document.createElement('button');
    btnHard.classList.add('btn-hard');
    const btnLearned = document.createElement('button');
    btnLearned.classList.add('btn-learned');
    btnsContainer.append(btnHard, btnLearned);

    cardControls.append(wordContainer, sentenseContainer, soundBtn, btnsContainer);
  }
}