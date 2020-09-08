import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { store, persistor } from './common/store/configureStore';
import Routes from './common/routes';
import registerServiceWorker from './client/registerServiceWorker';

import './client/styles/index.css';

const render = Component => {
  ReactDOM.render(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Component />
      </PersistGate>
    </Provider>,
    document.getElementById('root')
  );
}

render(Routes);

registerServiceWorker();