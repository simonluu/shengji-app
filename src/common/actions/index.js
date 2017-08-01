import axios from 'axios';
import { generate } from 'shortid';

export const CHANGE_TEAM = 'CHANGE_TEAM';
export const CHANGE_PHASE = 'CHANGE_PHASE';
export const ADD_SELECTED_CARD = 'ADD_SELECTED_CARD';
export const REMOVE_SELECTED_CARD = 'REMOVE_SELECTED_CARD';
export const EMPTY_SELECTED_CARD = 'EMPTY_SELECTED_CARD';
export const ADD_SWAP_CARD = 'ADD_SWAP_CARD';
export const REMOVE_SWAP_CARD = 'REMOVE_SWAP_CARD';
export const EMPTY_SWAP_CARD = 'EMPTY_SWAP_CARD';
export const GET_GAME = 'GET_GAME';
export const CREATE_GAME = 'CREATE_GAME';
export const JOIN_GAME = 'JOIN_GAME';
export const LEAVE_GAME = 'LEAVE_GAME';
export const DELETE_GAME = 'DELETE_GAME';
export const START_GAME = 'START_GAME';
export const CURRENT_USER = 'CURRENT_USER';
export const ADD_CARD = 'ADD_CARD';
export const SET_MASTER = 'SET_MASTER';
export const SWAP_CARD = 'SWAP_CARD';
export const PLAY_CARD = 'PLAY_CARD';
export const PHASE_END = 'PHASE_END';
export const RESTART_ROUND = 'RESTART_ROUND';

const server = 'server/';

export function recentUser(name) {
  return {
    type: CURRENT_USER,
    payload: name,
  };
}

export function changePhase(gameId, phase) {
  return {
    type: `${server+CHANGE_PHASE}`,
    payload: phase,
    id: gameId,
  };
}

export function addSelectedCard(name, suit, value, playedBy, unique, sortValue, trump, id) {
  const card = {
    name,
    suit,
    value,
    playedBy,
    unique,
    sortValue,
    trump,
    _id: id,
  };

  return {
    type: ADD_SELECTED_CARD,
    payload: card,
  };
}

export function removeSelectedCard(name, suit, value, playedBy, unique, sortValue, trump, id) {
  const card = {
    name,
    suit,
    value,
    playedBy,
    unique,
    sortValue,
    trump,
    _id: id,
  };

  return {
    type: REMOVE_SELECTED_CARD,
    payload: card,
  };
}

export function emptySelectedCard() {
  return {
    type: EMPTY_SELECTED_CARD,
    payload: [],
  };
}

export function addSwapCard(name, suit, value, playedBy, unique, sortValue, trump, id) {
  const card = {
    name,
    suit,
    value,
    playedBy,
    unique,
    sortValue,
    trump,
    _id: id,
  };

  return {
    type: ADD_SWAP_CARD,
    payload: card,
  };
}

export function removeSwapCard(name, suit, value, playedBy, unique, sortValue, trump, id) {
  const card = {
    name,
    suit,
    value,
    playedBy,
    unique,
    sortValue,
    trump,
    _id: id,
  };

  return {
    type: REMOVE_SWAP_CARD,
    payload: card,
  };
}

export function emptySwapCard() {
  return {
    type: EMPTY_SWAP_CARD,
    payload: [],
  };
}

export function getGame(id) {
  const request = axios.get(`/api/get-game/${id}`);

  return {
    type: GET_GAME,
    payload: request,
  };
}

export function changeTeam(gameId, index, value) {
  const request = axios.post('/api/change-team', {
    gameId,
    index,
    value,
  }).catch((error) => {
    throw error;
  });

  return {
    type: `${server+CHANGE_TEAM}`,
    payload: request,
  }
}

export function createGame(name, reroute) {
  const gameId = generate();

  const request = axios.post('/api/create-game', {
    gameId,
    creator: [name.toLowerCase()],
  }).then((response) => {
    if (response.status === 200) {
      reroute();
    }
    return response;
  }).catch((error) => {
    throw error;
  });

  return {
    type: `${server+CREATE_GAME}`,
    payload: request,
  };
}

export function joinGame(gameId, name, reroute) {
  const request = axios.post('/api/join-game', {
    gameId,
    userJoined: name.toLowerCase(),
  }).then((response) => {
    if (response.status === 200) {
      reroute();
    }
    return response;
  }).catch((error) => {
    throw error;
  });

  return {
    type: `${server+JOIN_GAME}`,
    payload: request,
  };
}

export function leaveGame(gameId, name, index, reroute) {
  const request = axios.post('/api/leave-game', {
    gameId,
    index,
    userLeft: name,
  }).then((response) => {
    if (response.status === 200) {
      reroute();
    }
    return response;
  }).catch((error) => {
    throw error;
  });

  return {
    type: `${server+LEAVE_GAME}`,
    payload: request,
  };
}

export function deleteGame(gameId, reroute) {
  const request = axios.delete(`/api/delete-game/${gameId}`)
  .then((response) => {
    if (response.status === 200) {
      reroute();
    }
    return response;
  }).catch((error) => {
    throw error;
  });

  return {
    type: `${server+DELETE_GAME}`,
    payload: request,
  };
}

export function startGame(gameId) {
  const request = axios.post('/api/start-game', {
    gameId,
  }).catch((error) => {
    throw error;
  });

  return {
    type: `${server+START_GAME}`,
    payload: request,
  };
}

export function addCardToHand(gameId, playerTurn, card) {
  const request = axios.post('/api/add-to-hand', {
    gameId,
    playerTurn,
    card,
  }).catch((error) => {
    throw error;
  });

  return {
    type: `${server+ADD_CARD}`,
    payload: request,
  };
}

export function setNewMaster(gameId, player, cards, pair) {
  const request = axios.post('/api/set-master', {
    gameId,
    cards,
    pair,
    currentUser: player,
  }).catch((error) => {
    throw error;
  });

  return {
    type: `${server+SET_MASTER}`,
    payload: request,
  };
}

export function swapCard(gameId, deckCards, handCards) {
  const request = axios.post('/api/swap-card', {
    gameId,
    deckCards,
    handCards,
  }).catch((error) => {
    throw error;
  });

  return {
    type: `${server+SWAP_CARD}`,
    payload: request,
  };
}

export function playCard(gameId, card) {
  const request = axios.post('/api/play-card', {
    gameId,
    playedCards: card,
  }).catch((error) => {
    throw error;
  });

  return {
    type: `${server+PLAY_CARD}`,
    payload: request,
  };
}

export function phaseEnd(gameId, center) {
  const request = axios.post('/api/phase-end', {
    gameId,
  }).catch((error) => {
    throw error;
  });

  return {
    type: `${server+PHASE_END}`,
    payload: request,
    previous: center,
  };
}

export function restartRound(gameId) {
  const request = axios.post('/api/restart-round', {
    gameId,
  }).catch((error) => {
    throw error;
  });

  return {
    type: `${server+RESTART_ROUND}`,
    payload: request,
  };
}
