const Game = require('../models/game-model');

module.exports = (req, res, next) => {
  const gameId = req.body.gameId;
  const index = req.body.index;
  const value = req.body.value;

  Game.model.findOne({ gameId }, (err, existingGame) => {
    if (err) { return next(err); }

    if (!existingGame) {
      return res.status(422).send({ error: 'Game does not exist' });
    }

    let newTeam = existingGame.teams;
    newTeam[index] = value;

    Game.model.findOneAndUpdate({ gameId }, { teams: newTeam }, { new: true }, (err, newGame) => {
      if (err) { return next(err); }

      if (!newGame) {
        return res.status(422).send({ error: 'Game does not exist' });
      }

      res.json(newGame);
    });
  });
};
