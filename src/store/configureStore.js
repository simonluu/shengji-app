import { createStore, applyMiddleware } from 'redux';
import createSocketIoMiddleware from 'redux-socket.io';
import io from 'socket.io-client';
import { persistStore, autoRehydrate } from 'redux-persist';
import { asyncSessionStorage } from 'redux-persist/storages';

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

  persistStore(store, { blacklist: ['currentUser', 'selectedCards', 'swapCards', 'phase'], storage: asyncSessionStorage });

  const saved_game_data = JSON.parse(sessionStorage.getItem('reduxPersist:gameInfo'));

  if (saved_game_data && saved_game_data.data.gameId) {
    socket.emit('user_reconnect', saved_game_data.data.gameId);
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