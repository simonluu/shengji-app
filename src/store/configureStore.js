import { createStore, applyMiddleware } from 'redux';
import createSocketIoMiddleware from 'redux-socket.io';
import io from 'socket.io-client';
import { persistStore, autoRehydrate } from 'redux-persist';
import { asyncSessionStorage } from 'redux-persist/storages';
import { routerMiddleware } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';
import _ from 'lodash';

import reducers from '../reducers';
import Async from '../middlewares/async';

export const history = createHistory();
const routerMiddlewareInstance = routerMiddleware(history);

const socket = io();
const socketIoMiddleware = createSocketIoMiddleware(socket, 'server/');

const configureStore = () => {
  const store = createStore(
    reducers,
    autoRehydrate(),
    applyMiddleware(Async, routerMiddlewareInstance, socketIoMiddleware),
  );

  persistStore(store, { whitelist: ['gameInfo', 'phase'], blacklist: ['currentUser', 'selectedCards', 'swapCards'], storage: asyncSessionStorage });

  const saved_game_data = JSON.parse(sessionStorage.getItem('reduxPersist:gameInfo'));

  if (saved_game_data && saved_game_data.data !== undefined) {
    if (saved_game_data.data.gameId && _.includes(saved_game_data.data.users, store.getState().currentUser)) {
      socket.emit('user_reconnect', saved_game_data.data.gameId);
    }
  }

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