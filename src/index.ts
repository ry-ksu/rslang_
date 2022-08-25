import App from './components/app';

localStorage.setItem('victory', JSON.stringify({
  name: 'Laura',
  token: 'dfukj4485',
  page: 'mainPage',
}));

const app = new App();
app.render();
