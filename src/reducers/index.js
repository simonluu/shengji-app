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

function centerReducer(state = [], action) {
  switch (action.type) {
    case PHASE_END:
      return action.previous;
    default:
      return state;
  }
}

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
    case CHANGE_TEAM:
    case JOIN_GAME:
    case LEAVE_GAME:
    case DELETE_GAME:
    case START_GAME:
    case ADD_CARD:
    case SET_MASTER:
    case SWAP_CARD:
    case PLAY_CARD:
    case PHASE_END:
    case RESTART_ROUND:
      return Object.assign({}, state, action.payload);
    case CREATE_GAME:
      sessionStorage.setItem('currentUser', action.payload.data.users[0].toLowerCase());
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
}


const initialUserState = { currentUser: '' };
function currentUserReducer(state = initialUserState.currentUser, action) {
  switch (action.type) {
    case CURRENT_USER:
      sessionStorage.setItem('currentUser', action.payload.toLowerCase());
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
  center: centerReducer,
  currentUser: currentUserReducer,
  router: routerReducer,
});

export default rootReducer;