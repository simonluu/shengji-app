const Game = require('../models/game-model');

module.exports = (req, res, next) => {
  const gameId = req.body.gameId;
  const playedCards = req.body.playedCards;

  Game.model.findOne({ gameId }, (err, existingGame) => {
    if (err) { return next(err); }

    if (!existingGame) {
      return res.status(422).send({ error: 'Game does not exist' });
    }

    // increment turn
    let turnNumber = existingGame.turnNumber;
    let firstPlayed = existingGame.firstPlayed;
    if (turnNumber === 0) {
      firstPlayed = playedCards;
    }
    turnNumber += 1;

    // if card.trump is true change broken trump to true
    let brokenTrump = existingGame.brokenTrump;
    for (let j = 0; j < playedCards.length; j += 1) {
      if (playedCards[j].trump) {
        brokenTrump = true;
        break;
      }
    }

    const currentPlayer = existingGame[existingGame.turn];

    const newCenter = existingGame.center;
    const newHand = currentPlayer.hand;

    for (let i = 0; i < playedCards.length; i += 1) {
      const playCard = newHand.find(card =>
        card.name === playedCards[i].name && card.suit === playedCards[i].suit
        && card.unique === playedCards[i].unique);

      playCard.playedBy = existingGame.turn;

      const indexOfCard = newHand.indexOf(playCard);

      newCenter.push(playCard);
      newHand.splice(indexOfCard, 1);
    }

    // currentPlayer.hand = newHand;

    const split = existingGame.turn.split('_');
    let playerNumber = parseInt(split[1]);
    if (playerNumber === 4) {
      playerNumber = 0;
    }
    const nextPlayer = `${split[0]}_${playerNumber + 1}`;

    // existingGame.save();

    Game.model.findOneAndUpdate({ gameId }, { brokenTrump, firstPlayed, turnNumber, center: newCenter, turn: nextPlayer }, { new: true }, (err, newGame) => {
      if (err) { return next(err); }
      
      if (!newGame) {
        return res.status(422).send({ error: 'Game does not exist' });
      }

      newGame[existingGame.turn].hand = newHand;

      newGame.save();

      res.json(newGame);
    });
  });
};
