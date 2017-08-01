const Game = require('../models/game-model');

module.exports = (req, res, next) => {
  const gameId = req.body.gameId;
  const creator = req.body.creator;

  Game.model.findOne({ gameId }, (err, existingGame) => {
    if (err) { return next(err); }

    if (existingGame) {
      return res.status(422).send({ error: 'Game already exists' });
    }

    const newGame = new Game.model({
      gameId,
      users: creator,
      teams: [0],
      gameStart: false,
      round: 0,
      pair: false,
      brokenTrump: false,
      trumpSuit: '',
      trumpNumber: 2,
      turn: '',
      turnNumber: 0,
      firstPlayed: [],
      currentMaster: '',
      deck: [],
      revealedTrump: [],
      center: [],
    });

    newGame.save();

    res.json(newGame);
  });
};
