import App from './components/app';
import 'animate.css';
import Auth from './components/authorization/controller';

const app = new App();
app.render();

const auth = new Auth();
auth.renderAuth()
auth.authenification();

