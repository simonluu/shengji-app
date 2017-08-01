const Game = require('../models/game-model');

module.exports = (req, res, next) => {
  const gameId = req.body.gameId;
  const userLeft = req.body.userLeft;
  const indexOfUser = req.body.index;

  Game.model.findOneAndUpdate({ gameId }, { $pull: { users: userLeft } }, { new: true }, (err, existingGame) => {
    if (err) { return next(err); }

    if (!existingGame) {
      return res.status(422).send({ error: 'Game does not exist' });
    }

    existingGame.teams.splice(indexOfUser, 1);

    existingGame.save();

    res.json(existingGame);
  });
};
