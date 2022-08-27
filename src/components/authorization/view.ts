import { AuthOption } from './contrats';
import { createHtmlEl } from './helpers';

const renderInputEl = (title: string): HTMLElement => {
  const wrapper = createHtmlEl('div', 'body__item');

  const label = createHtmlEl('label', '', `${title}: `) as HTMLLabelElement;
  label.htmlFor = title;
  const loginInput = createHtmlEl('input', 'popup__input') as HTMLInputElement;
  loginInput.id = title;

  wrapper.appendChild(label);
  wrapper.appendChild(loginInput);
  return wrapper;
};

const renderButtons = (option: string): HTMLElement => {
  const wrapper = createHtmlEl('div', 'popupButtons');
  const signIn = createHtmlEl('button', 'popup__btn', 'Войти');
  signIn.setAttribute('data', 'signIn');
  const signUp = createHtmlEl('button', 'popup__btn', 'Зарегестрироваться');
  signUp.setAttribute('data', 'signUp');

  if (option === 'signIn') {
    signIn.classList.add('primary-button');
    signUp.classList.add('additional-button');
  } else {
    signUp.classList.add('primary-button');
    signIn.classList.add('additional-button');
  }
  wrapper.appendChild(signIn);
  wrapper.appendChild(signUp);
  return wrapper;
};

const renderSignIn = (body: HTMLElement): void => {
  const mail = renderInputEl('mail');
  mail.classList.add('mail');

  const password = renderInputEl('password');
  password.classList.add('password');

  body.appendChild(mail);
  body.appendChild(password);
  body.appendChild(renderButtons('signIn'));
};

const renderSignUp = (body: HTMLElement): void => {
  const name = renderInputEl('name');
  name.classList.add('name');

  const mail = renderInputEl('mail');
  mail.classList.add('mail');

  const password = renderInputEl('password');
  password.classList.add('password');

  body.appendChild(name);
  body.appendChild(mail);
  body.appendChild(password);
  body.appendChild(renderButtons('signUp'));
};

const fillPopupByOption: Record<AuthOption, (body: HTMLElement) => void> = {
  signIn: (body) => renderSignIn(body),
  signUp: (body) => renderSignUp(body),
};

const renderPopup = (option: AuthOption): HTMLElement => {
  const wrapper = createHtmlEl('div', 'outside');
  const popup = createHtmlEl('div', 'popup');
  popup.setAttribute('data', option);

  const close = createHtmlEl('div', 'popup__close', 'X');
  const body = createHtmlEl('div', 'popup__body');

  fillPopupByOption[option](body);

  popup.appendChild(body);
  popup.appendChild(close);
  wrapper.appendChild(popup);
  return wrapper;
};

export const updatePopup = (option: AuthOption): void => {
  const popupBody = document.querySelector('.popup__body') as HTMLElement;
  popupBody.innerHTML = '';

  fillPopupByOption[option](popupBody);
  document.querySelector('.popup')?.setAttribute('data', option);
};

export default function renderAuth(option = 'signIn' as AuthOption): void {
  const popup = renderPopup(option);
  document.querySelector<HTMLElement>('body')?.appendChild(popup);
}
