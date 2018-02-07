import 'assets/css/global.less';
import 'assets/css/mod_css/commom.css';
import 'assets/css/mod_css/picker.css';
import 'assets/css/mod_css/LCalendar.css';
import 'assets/css/mod_css/mask.less';
import createApp from '../../utils/createApp';
import router from '../../routes/route';

if (process.env.NODE_ENV === 'development' && process.env.DEBUG) {
  const eruda = require('eruda');
  // open debug mode
  eruda.init();
}

window.$$ = Dom7; //eslint-disable-line

window.globalParams = {};

window.app = createApp(router);

window.app.mainView = window.app.addView('.view-main', { domCache: true });

if (location.hash === '') {
  window.app.mainView.router.load({
    url: 'p/beforeLogin.html',
    animatePages: true,
  });
}

