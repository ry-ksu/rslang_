import { IAttributes } from '../types/types';

export default class ViewMainPage {
  drawMainBlock() {
    const mainBlock = document.createElement('div');
    mainBlock.className = 'main-block';
    mainBlock.innerHTML = `<div class='main-block__content'>
                            <h2>VICTORY</h2>
                            <h4>Обучение английскому никогда еще не было таким простым</h4>
                            <p>Запоминай английские слова играя! На твой выбор есть 2 игры: 
                            на скорость реакции, где ты будешь тренировать быстроту своего мышления или
                            на распознование английской речи, где мы выберешь перевод услышанного слова.
                            Выбери уровень сложности, и попробуй!</p>
                            <button class="additional-button">Попробуй!</button>
                          </div>
                          <div class='main-block__img'></div>`;
    return mainBlock;
  }

  drawBenefits() {
    const benefitCards = document.createElement('div');
    const benefitCardContent = document.createElement('div');
    benefitCardContent.className = 'benefit-card__content';
    benefitCards.className = 'benefit-cards';
    const benefitCount = 4;
    benefitCards.innerHTML = `<h3>Оцените преимущества приложения</h3>
                              <h4>Зарегистрируйтесь, чтобы использовать все возможности</h4>`;
    const img = ['1.png', '1.png', '1.png', '1.png'];
    const paragraphHeaders = ['Учебник', 'Сложные слова', 'Статистика', 'Игры'];
    const paragraph = [
      'Коллекция из 3 600 наиболее употребляемых английских слов, разбитых по уровню сложности',
      'Есть слова, которые все никак не даются? Помести их в свой персональный словарь и сможешь уделять им особое внимание',
      'Отслеживай свой прогресс в индивидуальной статистике! Смотри свои успехи за каждый день или все время',
      'Увлекательные игры, которые помогут тебе лучше воспринимать слова на слух, а также быстрее запомнить их',
    ];

    for (let i = 0; i < benefitCount; i += 1) {
      const benefitCard = document.createElement('div');
      benefitCard.className = 'benefit-card';
      benefitCard.innerHTML = `<div class='benefit-card__img ${img[i]}'></div>
                               <h4>${paragraphHeaders[i]}</h4>
                               <p>${paragraph[i]}</p>`;

      benefitCardContent.append(benefitCard);
    }

    benefitCards.append(benefitCardContent);
    return benefitCards;
  }

  drawMain(attributes: IAttributes) {
    const mainBlock = this.drawMainBlock();
    const benefits = this.drawBenefits();

    attributes.component.append(mainBlock, benefits);
  }
}
