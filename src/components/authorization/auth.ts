import LocalStorage from '../../services/store';
import WordsApi from '../../services/wordsAPI';
import { IUserStatistics, IUserToken, voidFn } from '../types/types';
import animateCSS from './animate';
import { AuthOption, checkValueFn, SignUpOptions } from './contracts';
import { createHtmlEl } from './helpers';
import { togglePopupAppearance } from './togglePopupState';
import { updatePopup } from './view';
import getUserStatistics, { cleanTodayStats } from '../statistics/getEmptyStatistics';

const testValue = (comparator: RegExp, value: string): boolean => comparator.test(value);

const cleanErrors = (): void => {
  const errors = document.querySelectorAll('.error');
  if (errors.length) {
    errors.forEach((el) => (el as HTMLHtmlElement).remove());
  }
};

const errorMsg: Record<SignUpOptions, () => string> = {
  name: () => 'The name must be in Latin and at least contain 3 characters',
  email: () => 'The mail is not correct, e.g some@mail.ru',
  password: () => 'Password must contain only Latin or digits and at least contain 8 characters',
};

const handleError = (selector: SignUpOptions) => {
  const el = document.querySelector<HTMLElement>(`.${selector}`);
  const errorr = createHtmlEl('div', 'error', errorMsg[selector]());
  el?.appendChild(errorr);
};

const checkValuesByOption: Record<SignUpOptions, checkValueFn> = {
  name: (value) => {
    const regexpName = /^[A-Z]{3,20}$/i;
    return testValue(regexpName, value);
  },
  email: (value) => {
    const regexpMail = /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/;
    return testValue(regexpMail, value);
  },
  password: (value) => {
    const regexpPassword = /^[a-zA-Z0-9]{8,20}$/;
    return testValue(regexpPassword, value);
  },
};

const checkValues = (): boolean => {
  cleanErrors();

  const values = Object.keys(checkValuesByOption).filter((key) => {
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
};

const blockButtons = (): void => {
  const buttons = document.querySelectorAll('.popup__btn');
  buttons.forEach((btn) => btn.setAttribute('disabled', 'true'));
};

const unBlockButtons = (): void => {
  const buttons = document.querySelectorAll('.popup__btn');
  buttons.forEach((btn) => btn.removeAttribute('disabled'));
};

const authorization = async (
  email: string,
  password: string,
  api: WordsApi,
  localStorage: LocalStorage
): Promise<IUserToken> => {
  try {
    const user: IUserToken = await api.signUser({ email, password });
    localStorage.changeLS('token', user.token);
    localStorage.changeLS('refreshToken', user.refreshToken);
    localStorage.changeLS('userId', user.userId);
    localStorage.changeLS('name', user.name);

    const popup = document.querySelector<HTMLElement>('.popup');
    animateCSS(popup as HTMLElement, 'zoomOut', '0.7s')
      .then(() => {
        togglePopupAppearance();
        unBlockButtons();
        updatePopup('signIn');
      })
      .catch((err) => console.log(err));
    return user;
  } catch (err) {
    throw new Error('Failed in authorization');
  }
};

const singIn = async (api: WordsApi, localStorage: LocalStorage): Promise<void> => {
  if (!checkValues()) {
    return;
  }
  const email = document.getElementById('email') as HTMLInputElement;
  const password = document.getElementById('password') as HTMLInputElement;

  try {
    blockButtons();
    const user = await authorization(email.value, password.value, api, localStorage);
    const userStatistics = await api.getUserStatistics({ userID: user.userId, token: user.token });
    const { learnedWords, optional } = userStatistics;
    let currentStats: IUserStatistics = { learnedWords, optional }
    const date = new Date().setHours(0, 0, 0, 0);
    if (currentStats.optional.todayStatistics.date !== date) {
      currentStats = cleanTodayStats(date, userStatistics);
      await api.updateUserStatistics({
        userID: user.userId,
        userStatistics,
        token: user.token,
      });
    }
    if (currentStats.optional.longStatistics.days.every(day => day.date !== date)) {
      currentStats.optional.longStatistics.days.push({ date, newWords: [], learnedWords: [] })
    }
  } catch (err) {
    email.value = '';
    password.value = '';
    document
      .querySelector<HTMLElement>('.password')
      ?.appendChild(createHtmlEl('div', 'error', 'mail or password incorrect'));
    throw new Error('incorrect mail or password');
  }
};

const singUp = async (api: WordsApi, localStorage: LocalStorage): Promise<void> => {
  if (!checkValues()) {
    return;
  }
  const name = document.getElementById('name') as HTMLInputElement;
  const email = document.getElementById('email') as HTMLInputElement;
  const password = document.getElementById('password') as HTMLInputElement;

  try {
    blockButtons();
    await api.createUser({
      name: name.value,
      email: email.value,
      password: password.value,
    });
    const date = new Date().setHours(0, 0, 0, 0);
    const userStatistics = getUserStatistics(date);
    const newUser = await authorization(email.value, password.value, api, localStorage);
    await api.updateUserStatistics({
      userID: newUser.userId,
      userStatistics,
      token: newUser.token,
    });
    name.value = '';
    email.value = '';
    password.value = '';
  } catch (err) {
    document
      .querySelector<HTMLElement>('.email')
      ?.appendChild(createHtmlEl('div', 'error', 'enter another email'));
    throw new Error('incorrect mail');
  }
};

const authByOption: Record<
  AuthOption,
  (api: WordsApi, localStorage: LocalStorage) => Promise<void>
> = {
  signIn: async (api, localStorage) => singIn(api, localStorage),
  signUp: async (api, localStorage) => singUp(api, localStorage),
};

export default (api: WordsApi, localStorage: LocalStorage, callback: voidFn) => {
  document.addEventListener('click', (e: Event) => {
    const target = e.target as HTMLElement;
    if (!target.matches('.popup__btn')) {
      return;
    }

    const popup = document.querySelector<HTMLElement>('.popup');

    if (popup?.getAttribute('data') !== target.getAttribute('data')) {
      return;
    }

    const option = popup.getAttribute('data') as AuthOption;

    authByOption[option](api, localStorage)
      .then(() => callback())
      .catch(() => unBlockButtons());
  });
};
