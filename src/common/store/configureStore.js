import { createStore, applyMiddleware } from 'redux';
import createSocketIoMiddleware from 'redux-socket.io';
import io from 'socket.io-client';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import _ from 'lodash';

import reducers from '../reducers';
import Async from '../middlewares/async';

const socket = io();
const socketIoMiddleware = createSocketIoMiddleware(socket, 'server/');

const persistConfig = {
  key: 'root',
  storage: storage,
  whitelist: ['gameInfo', 'phase'],
  blacklist: ['currentUser', 'selectedCards', 'swapCards']
};
const persistedReducer = persistReducer(persistConfig, reducers);

const configureStore = () => {
  const store = createStore(
    persistedReducer,
    applyMiddleware(Async, socketIoMiddleware),
  );

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

export let store = configureStore();
export let persistor = persistStore(store);