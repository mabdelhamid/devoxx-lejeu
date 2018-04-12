import 'core-js/shim';

import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { configureStore } from 'state/configureStore';
import App from 'component/App';
import { loggedIn } from 'state/hero/heroAction';

import 'bootstrap/dist/css/bootstrap.min.css';
import Auth from 'service/auth';
import { registerProfile } from 'state/hero';

export const auth = new Auth();
function bootstrap() {
  let store = configureStore();
  auth.handleAuthentication();

  render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('main')
  );

  if (auth.isAuthenticated()) {
    store.dispatch(loggedIn());
    auth.getProfile((err, userProfile) => {
      if (userProfile) {
        const { user_id, sub, name, nickname, picture, email } = userProfile;
        store.dispatch(
          registerProfile({
            id: user_id || sub,
            email,
            name,
            nickname,
            avatarUrl: picture
          })
        );
      } else {
        throw Error(JSON.stringify(err));
      }
    });
  }
}

bootstrap();
