const Game = require('../models/game-model');
const _ = require('lodash');

module.exports = (req, res, next) => {
  const gameId = req.body.gameId;
  const deckCards = req.body.deckCards;
  const handCards = req.body.handCards;

  Game.model.findOne({ gameId }, (err, existingGame) => {
    if (err) { return next(err); }

    if (!existingGame) {
      return res.status(422).send({ error: 'Game does not exist' });
    }

    const currentMaster = existingGame.currentMaster;

    const currentPlayer = existingGame[currentMaster];
    const newDeck = existingGame.deck;
    const newHand = currentPlayer.hand;

    for (let i = 0; i < deckCards.length; i += 1) {
      const cardDeck = newDeck.find(card => card.name === deckCards[i].name
        && card.suit === deckCards[i].suit
        && card.unique === deckCards[i].unique);

      const cardHand = newHand.find(card => card.name === handCards[i].name
        && card.suit === handCards[i].suit
        && card.unique === handCards[i].unique);

      const indexOfCardDeck = newDeck.indexOf(cardDeck);
      const indexOfCardHand = newHand.indexOf(cardHand);

      newDeck[indexOfCardDeck] = cardHand;
      newHand[indexOfCardHand] = cardDeck;
    }

    const sortedNewHand = _.orderBy(newHand, ['sortValue'], ['desc']);

    Game.model.findOneAndUpdate({ gameId }, { deck: newDeck, turn: currentMaster }, { new: true }, (err, newGame) => {
      if (err) { return next(err); }

      if (!newGame) {
        return res.status(422).send({ error: 'Game does not exist' });
      }

      newGame[currentMaster].hand = sortedNewHand;

      newGame.save();

      res.json(newGame);
    });
  });
};
