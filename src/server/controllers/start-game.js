const Game = require('../models/game-model');
const Player = require('../models/player-model');
const Card = require('../models/card-model');

const helper = require('./helper-functions');

module.exports = (req, res, next) => {
  const gameId = req.body.gameId;

  Game.model.findOneAndUpdate({ gameId }, { gameStart: true, turn: 'player_1' }, { new: true }, (err, existingGame) => {
    if (err) { return next(err); }

    if (!existingGame) {
      return res.status(422).send({ error: 'Game does not exist' });
    }

    // add users and cards into the deck
    const tempCards = [];
    const tempTrumps = [];
    let newDeck = [];
    const cardName = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const cardSuit = ['Club', 'Spade', 'Diamond', 'Heart'];

    for (let i = 0; i < existingGame.users.length; i += 1) {
      let position = existingGame.teams[i];
      if ((existingGame.teams[i] === 1 && existingGame.player_1 !== undefined) || (existingGame.teams[i] === 2 && existingGame.player_2 !== undefined)) {
        position = existingGame.teams[i] + 2;
      }

      const player = new Player.model({
        playerName: existingGame.users[i],
        player: `player_${position}`,
        team: `${existingGame.teams[i]}`,
        master: false,
        trumpNumber: 2,
        score: 0,
        hand: [],
      });

      existingGame[player.player] = player;
    }

    for (let j = 0; j < cardSuit.length; j += 1) {
      for (let k = 0; k < cardName.length; k += 1) {
        let value = parseInt(cardName[k]);
        if (cardName[k] === 'J') {
          value = 11;
        } else if (cardName[k] === 'Q') {
          value = 12;
        } else if (cardName[k] === 'K') {
          value = 13;
        } else if (cardName[k] === 'A') {
          value = 14;
        }

        for (let l = 1; l <= 2; l += 1) {
          const card = new Card.model({
            value,
            name: cardName[k],
            suit: cardSuit[j],
            playedBy: '',
            unique: l,
            sortValue: 0,
            trump: value === existingGame.trumpNumber,
          });

          if (value === existingGame.trumpNumber) {
            tempTrumps.push(card);
          } else {
            tempCards.push(card);
          }
        }
      }
    }

    let sortValue = 0;
    for (let n = 0; n < tempCards.length; n += 1) {
      tempCards[n].sortValue = sortValue;
      if (n % 2 === 1) {
        sortValue += 1;
      }
    }

    for (let o = 0; o < tempTrumps.length; o += 1) {
      tempTrumps[o].sortValue = sortValue;
      if (o % 2 === 1) {
        sortValue += 1;
      }
    }

    newDeck = tempCards.concat(tempTrumps);

    // adds big/little jokers into the deck
    for (let a = 1; a <= 2; a += 1) {
      const bigJoker = new Card.model({
        name: 'Big Joker',
        suit: 'Wild',
        value: 16,
        playedBy: '',
        unique: a,
        sortValue: 53,
        trump: true,
      });

      const littleJoker = new Card.model({
        name: 'Little Joker',
        suit: 'Wild',
        value: 15,
        playedBy: '',
        unique: a,
        sortValue: 52,
        trump: true,
      });

      newDeck.push(bigJoker);
      newDeck.push(littleJoker);
    }

    // shuffles the deck 7 times.
    helper.shuffleDeck(newDeck);

    existingGame.deck = newDeck;

    existingGame.save();

    res.json(existingGame);
  });
};
