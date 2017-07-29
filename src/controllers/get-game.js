const Game = require('../models/game-model');

module.exports = (req, res, next) => {
  Game.model.findOne({ gameId: req.params.id }, (err, existingGame) => {
    if (err) { return next(err); }

    if (!existingGame) {
      return res.status(422).send({ error: 'Game does not exist' });
    }

    res.json(existingGame);
  });
};
