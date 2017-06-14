const Game = require('../models/game-model');
const _ = require('lodash');

module.exports = (req, res, next) => {
  const gameId = req.body.gameId;
  const playerTurn = req.body.playerTurn;
  const card = req.body.card;

  const split = playerTurn.split('_');
  let playerNumber = parseInt(split[1]);
  if (playerNumber === 4) {
    playerNumber = 0;
  }
  const nextPlayer = `${split[0]}_${playerNumber + 1}`;

  Game.model.findOneAndUpdate({ gameId }, { turn: nextPlayer, $pop: { deck: 1 } }, { new: true }, (err, existingGame) => {
    if (err) { return next(err); }

    if (!existingGame) {
      return res.send(422).send({ error: 'Game does not exist' });
    }

    const currentPlayer = existingGame[playerTurn];
    const newHand = currentPlayer.hand;

    newHand.push(card);

    const sortedNewHand = _.orderBy(newHand, ['sortValue'], ['desc']);

    currentPlayer.hand = sortedNewHand;

    existingGame.save();

    res.json(existingGame);
  });
};
