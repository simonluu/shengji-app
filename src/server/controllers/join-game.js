const Game = require('../models/game-model');

module.exports = (req, res, next) => {
  const gameId = req.body.gameId;
  const userJoined = req.body.userJoined;

  Game.model.findOne({ gameId }, (err, existingGame) => {
    if (err) { return next(err); }

    if (!existingGame) {
      res.json({ error: 'Invalid GameID' });
    } else if (existingGame.users.length < 4) {
      if (!existingGame.users.includes(userJoined)) {
        Game.model.findOneAndUpdate({ gameId }, { $addToSet: { users: userJoined } }, { new: true }, (err, newGame) => {
          if (err) { return next(err); }

          let newTeam = newGame.teams;
          newTeam.push(0);

          newGame.save();

          res.json(newGame);
        });
      } else {
        res.json({ error: 'That name is already taken' });
      }
    } else {
      res.json({ error: 'Room is full' });
    }
  });
};
