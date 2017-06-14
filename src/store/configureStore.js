import { createStore, applyMiddleware } from 'redux';
import createSocketIoMiddleware from 'redux-socket.io';
import io from 'socket.io-client';
import { persistStore, autoRehydrate } from 'redux-persist';

import reducers from '../reducers';
import Async from '../middlewares/async';

const socket = io();
const socketIoMiddleware = createSocketIoMiddleware(socket, 'server/');

const configureStore = () => {
  const store = createStore(
    reducers,
    autoRehydrate(),
    applyMiddleware(Async, socketIoMiddleware),
  );

  persistStore(store, { blacklist: ['gameInfo', 'currentUser', 'selectedCards', 'swapCards', 'phase', 'teams'] });

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