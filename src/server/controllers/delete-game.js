const Game = require('../models/game-model');

module.exports = (req, res, next) => {
  const gameId = req.params.id;

  Game.model.findOneAndRemove({ gameId }, (err, existingGame) => {
    if (err) { return next(err); }

    if (!existingGame) {
      return res.status(422).send({ error: 'Game does not exist' });
    }

    res.json({});
  });
};
