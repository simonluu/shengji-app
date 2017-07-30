import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import _ from 'lodash';

import {
  CHANGE_TEAM,
  CHANGE_PHASE,
  ADD_SELECTED_CARD,
  REMOVE_SELECTED_CARD,
  EMPTY_SELECTED_CARD,
  ADD_SWAP_CARD,
  REMOVE_SWAP_CARD,
  EMPTY_SWAP_CARD,
  GET_GAME,
  CREATE_GAME,
  JOIN_GAME,
  LEAVE_GAME,
  DELETE_GAME,
  START_GAME,
  CURRENT_USER,
  ADD_CARD,
  SET_MASTER,
  SWAP_CARD,
  PLAY_CARD,
  PHASE_END,
  RESTART_ROUND,
} from '../actions';

function phaseReducer(state = 'drawPhase', action) {
  switch (action.type) {
    case CHANGE_PHASE:
      return action.payload;
    default:
      return state;
  }
}

function selectedCardReducer(state = [], action) {
  switch (action.type) {
    case ADD_SELECTED_CARD:
      return [...state, action.payload];
    case REMOVE_SELECTED_CARD:
      return state.filter(card => !_.isEqual(card, action.payload));
    case EMPTY_SELECTED_CARD:
      return action.payload;
    default:
      return state;
  }
}

function swapCardReducer(state = [], action) {
  switch (action.type) {
    case ADD_SWAP_CARD:
      return [...state, action.payload];
    case REMOVE_SWAP_CARD:
      return state.filter(card => !_.isEqual(card, action.payload));
    case EMPTY_SWAP_CARD:
      return action.payload;
    default:
      return state;
  }
}

function gameReducer(state = {}, action) {
  switch (action.type) {
    case GET_GAME:
      return Object.assign({}, state, action.payload);
    case CHANGE_TEAM:
      return Object.assign({}, state, action.payload);
    case CREATE_GAME:
      sessionStorage.setItem('currentUser', action.payload.data.users[0]);
      return Object.assign({}, state, action.payload);
    case JOIN_GAME:
      return Object.assign({}, state, action.payload);
    case LEAVE_GAME:
      return Object.assign({}, state, action.payload);
    case DELETE_GAME:
      return Object.assign({}, state, action.payload);
    case START_GAME:
      return Object.assign({}, state, action.payload);
    case ADD_CARD:
      return Object.assign({}, state, action.payload);
    case SET_MASTER:
      return Object.assign({}, state, action.payload);
    case SWAP_CARD:
      return Object.assign({}, state, action.payload);
    case PLAY_CARD:
      return Object.assign({}, state, action.payload);
    case PHASE_END:
      return Object.assign({}, state, action.payload);
    case RESTART_ROUND:
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
}


const initialUserState = { currentUser: '' };
function currentUserReducer(state = initialUserState.currentUser, action) {
  switch (action.type) {
    case CURRENT_USER:
      sessionStorage.setItem('currentUser', action.payload);
      return action.payload;
    default:
      return sessionStorage.currentUser || state;
  }
}

const rootReducer = combineReducers({
  phase: phaseReducer,
  selectedCards: selectedCardReducer,
  swapCards: swapCardReducer,
  gameInfo: gameReducer,
  currentUser: currentUserReducer,
  router: routerReducer,
});

export default rootReducer;