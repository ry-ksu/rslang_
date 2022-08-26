import Loader from "../../services/loader";
import WordsApi from "../../services/wordsAPI";
import { IUserToken } from "../types/types";
import { AuthOption, checkValueFn, SignUpOptions } from "./contrats";
import { createHtmlEl } from "./helpers";
import { togglePopupAppearance } from "./togglePopupState";

const testValue = (comparator: RegExp, value: string): boolean => comparator.test(value);

const cleanErrors = (): void => {
  const errors = document.querySelectorAll('.error');
  if (errors.length) {
    errors.forEach((el) => (el as HTMLHtmlElement).remove())
  }
}

const errorMsg: Record<SignUpOptions, () => string> = {
  name: () => 'The name must be in Latin and at least contain 3 characters',
  mail: () => 'The mail is not correct, e.g some@mail.ru',
  password: () => 'Password must contain only Latin or digits and at least contain 8 characters',
}

const handleError = (selector: SignUpOptions) => {
  const el = document.querySelector<HTMLElement>(`.${selector}`);
  const errorr = createHtmlEl('div', 'error', errorMsg[selector]());
  el?.appendChild(errorr);
}

const checkValuesByOption: Record<SignUpOptions, checkValueFn> = {
  name: (value) => {
    const regexpName = /^[A-Z]{3,20}$/i;
    return testValue(regexpName, value);
  },
  mail: (value) => {
    const regexpMail = /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/;
    return testValue(regexpMail, value);
  },
  password: (value) => {
    const regexpPassword = /^[a-zA-Z0-9]{8,20}$/;
    return testValue(regexpPassword, value);
  }
}

const checkValues = (): boolean => {
  cleanErrors();

  const values = Object.keys(checkValuesByOption)
    .filter((key) => {
      const el = document.getElementById(key) as HTMLInputElement;
      if (!el) {
        return false;
      }
      return !checkValuesByOption[key as SignUpOptions](el.value);
    });

  if (values.length) {
    values.forEach((key) => handleError(key as SignUpOptions));
    return false;
  }
  return true;
}

const blockButtons = (): void => {
  const buttons = document.querySelectorAll('.popup__btn');
  buttons.forEach(btn => btn.setAttribute('disabled', 'true'));
}

const unBlockButtons = (): void => {
  const buttons = document.querySelectorAll('.popup__btn');
  buttons.forEach(btn => btn.removeAttribute('disabled'));
}

const authorization = async (email: string, password: string, api: WordsApi): Promise<void> => {
  const user: IUserToken = await api.signUser({ email, password });
  localStorage.setItem('user', JSON.stringify(user));
  togglePopupAppearance();
}

const singIn = async (api: WordsApi): Promise<void> => {
  if (!checkValues()) {
    return;
  }
  const email = document.getElementById('mail') as HTMLInputElement;
  const password = document.getElementById('password') as HTMLInputElement;
  
  try {
    blockButtons();
    await authorization(email.value, password.value, api);
    unBlockButtons();
  }
  catch (err) {
    console.log('signIn');
    document.querySelector<HTMLElement>('.password')
      ?.appendChild(createHtmlEl('div', 'error', 'mail or password incorrect'));
    unBlockButtons();
  }
  email.value = '';
  password.value = '';
}

const singUp = async (api: WordsApi): Promise<void> => {
  if (!checkValues()) {
    return;
  }
  const name = document.getElementById('name') as HTMLInputElement;
  const email = document.getElementById('mail') as HTMLInputElement;
  const password = document.getElementById('password') as HTMLInputElement;
  
  try {
    blockButtons();
    await api.createUser({
      name: name.value,
      email: email.value,
      password: password.value,
    });
    await authorization(email.value, password.value, api);
    name.value = '';
    email.value = '';
    password.value = '';
    unBlockButtons();
  }
  catch (err) {
    document.querySelector<HTMLElement>('.mail')
      ?.appendChild(createHtmlEl('div', 'error', 'enter another email'));
    unBlockButtons();
  }
}

const authByOption: Record<AuthOption, (api: WordsApi) => Promise<void>> = {
  signIn: (api) => singIn(api),
  signUp: (api) => singUp(api)
}

export default () => {
  document.addEventListener('click', (e: Event) => {
    const target = e.target as HTMLElement;
    if (!target.matches('.popup__btn')) {
      return;
    }

    const popup = document.querySelector<HTMLElement>('.popup');

    if (popup?.getAttribute('data') !== target.getAttribute('data')) {
      return;
    }

    const api = new WordsApi({ LoaderService: Loader });

    const option = popup.getAttribute('data') as AuthOption;
    authByOption[option](api).catch(err => console.log(err)) 
  });
}