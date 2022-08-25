import App from './components/app';
import 'animate.css';
import Auth from './components/authorization/controller'
import popup from './components/authorization/auth';

localStorage.setItem('victory', JSON.stringify({
  name: 'Laura',
  token: 'dfukj4485',
  page: 'main-page',
}));

const app = new App();
app.render();

const auth = new Auth();
auth.renderAuth()

popup();

