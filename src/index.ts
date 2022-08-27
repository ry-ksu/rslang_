import App from './components/app';
import 'animate.css';
import Auth from './components/authorization/controller';

const app = new App();
app.render();

const auth = new Auth();
auth.renderAuth()
auth.authorization();

auth.checkAuth().then(() => console.log('success')).catch((err) => console.log('failed', err))