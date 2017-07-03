import { createStore, applyMiddleware } from 'redux';
import createSocketIoMiddleware from 'redux-socket.io';
import io from 'socket.io-client';
import { persistStore, autoRehydrate } from 'redux-persist';
import uuidv1 from 'uuid/v1';

import reducers from '../reducers';
import Async from '../middlewares/async';

const socket = io();
if (sessionStorage.getItem('uniqueUserId') === null) {
  sessionStorage.setItem('uniqueUserId', uuidv1());
}
socket.emit('register', sessionStorage.getItem('uniqueUserId'));
const socketIoMiddleware = createSocketIoMiddleware(socket, 'server/');

window.onbeforeunload = () => {
  localStorage.removeItem('uniqueUserId');
  return '';
};

const configureStore = () => {
  const store = createStore(
    reducers,
    autoRehydrate(),
    applyMiddleware(Async, socketIoMiddleware),
  );

  persistStore(store, { blacklist: ['currentUser', 'selectedCards', 'swapCards', 'phase'] });

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers').default;
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}

export default configureStore;