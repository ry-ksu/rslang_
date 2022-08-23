import animateCSS from "./animate";
import { PopupOption, updatePopup } from "./view";

const togglePopupAppearance = (): void => {
  const outside = document.querySelector<HTMLElement>('.outside');
  const popup = document.querySelector<HTMLElement>('.popup');
  outside?.classList.toggle('show');
  popup?.classList.toggle('show');
};

export const togglePopupState = ():void => {
  document.addEventListener('click', (e: Event) => {
    const target = e.target as HTMLElement;
    if (!target.matches('.popup__btn')) {
      return;
    }
    const popup = document.querySelector('.popup') as HTMLElement;
    const option = (target.getAttribute('data') ?? 'signIn') as PopupOption;
    if (document.querySelector('.popup')?.getAttribute('data') === option) {
      return;
    }
    animateCSS(popup, 'pulse')
      .then(() => updatePopup(option))
      .catch((err) => console.log(err))
  });
} 

export const hidePopup = (): void => {
  document.addEventListener('click', (e: Event) => {
    const target = e.target as HTMLElement;
    const popup = document.querySelector<HTMLElement>('.popup');
    const outside = document.querySelector<HTMLElement>('.outside');

    if (!outside?.classList.contains('show') || popup?.matches('.animate__animated')) {
      return;
    }

    if (!target.closest('.popup') || target.matches('.popup__close')) {
      animateCSS(popup as HTMLElement, 'zoomOut', '0.7s')
        .then(() => {
          togglePopupAppearance();
          updatePopup('signIn');
        })
        .catch((err) => console.log(err))
    }
  });
};

export const showPopup = (): void => {
  document.addEventListener('click', (e: Event) => {
    const target = e.target as HTMLElement;
    const popup = document.querySelector<HTMLElement>('.popup') as HTMLElement;

    if (!target.matches('[data-auth]' || popup.matches('.animate__animated'))) {
      return;
    }
    
    togglePopupAppearance();
    animateCSS(popup, 'zoomIn')
      .catch((err) => console.log(err))
  });
};
