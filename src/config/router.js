const getGame = require('../controllers/get-game');
const changeTeam = require('../controllers/change-team');
const createGame = require('../controllers/create-game');
const joinGame = require('../controllers/join-game');
const leaveGame = require('../controllers/leave-game');
const deleteGame = require('../controllers/delete-game');
const startGame = require('../controllers/start-game');
const addToHand = require('../controllers/add-to-hand');
const setMaster = require('../controllers/set-master');
const swapCard = require('../controllers/swap-card');
const playCard = require('../controllers/play-card');
const phaseEnd = require('../controllers/phase-end');
const restartRound = require('../controllers/restart-round');

module.exports = function router(app) {
  app.get('/api/get-game/:id', getGame);
  app.post('/api/change-team', changeTeam);
  app.post('/api/create-game', createGame);
  app.post('/api/join-game', joinGame);
  app.post('/api/leave-game', leaveGame);
  app.post('/api/delete-game', deleteGame);
  app.post('/api/start-game', startGame);
  app.post('/api/add-to-hand', addToHand);
  app.post('/api/set-master', setMaster);
  app.post('/api/swap-card', swapCard);
  app.post('/api/play-card', playCard);
  app.post('/api/phase-end', phaseEnd);
  app.post('/api/restart-round', restartRound);
};
