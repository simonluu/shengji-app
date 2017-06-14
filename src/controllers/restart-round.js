const Game = require('../models/game-model');
const Card = require('../models/card-model');

const helper = require('./helper-functions');

module.exports = (req, res, next) => {
  const gameId = req.body.gameId;

  Game.model.findOne({ gameId }, (err, existingGame) => {
    if (err) { return next(err); }

    if (!existingGame) {
      return res.status(422).send({ error: 'Game does not exist' });
    }

    const tempCards = [];
    const tempTrumps = [];
    let newDeck = [];
    const cardName = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const cardSuit = ['Club', 'Spade', 'Diamond', 'Heart'];

    const playerOne = existingGame.player_1;
    const playerTwo = existingGame.player_2;
    const playerThree = existingGame.player_3;
    const playerFour = existingGame.player_4;

    let newTrumpNumber = existingGame.trumpNumber;
    let gameStart = true;
    let newStarter = '';
    let newMaster = '';
    let newRound = existingGame.round;
    newRound += 1;

    if (playerOne.score > playerTwo.score) {
      // team one has more points at the end
      // assuming playerOne score === playerThree score
      if (playerOne.master && playerThree.master) {
        if (existingGame.currentMaster === 'player_1') {
          newMaster = 'player_3';
          newStarter = 'player_3';
        } else if (existingGame.currentMaster === 'player_3') {
          newMaster = 'player_1';
          newStarter = 'player_1';
        }
        if (playerTwo.score === 0) {
          // other team scored 0 points
          newTrumpNumber = playerOne.trumpNumber + 3;
        } else if (playerTwo.score >= 5 && playerTwo.score <= 35) {
          // other team scored between 5-35
          newTrumpNumber = playerOne.trumpNumber + 2;
        } else if (playerTwo.score >= 40 && playerTwo.score <= 75) {
          // other team scored between 40 and 75
          newTrumpNumber = playerOne.trumpNumber + 1;
        }
      } else {
        // set master to playerOne/playerThree
        if (existingGame.currentMaster === 'player_2') {
          newMaster = 'player_3';
          newStarter = 'player_3';
        } else if (existingGame.currentMaster === 'player_4') {
          newMaster = 'player_1';
          newStarter = 'player_1';
        }
        if (playerOne.score >= 120 && playerOne.score <= 155) {
          newTrumpNumber = playerOne.trumpNumber + 1;
        } else if (playerOne.score >= 160 && playerOne.Score <= 195) {
          newTrumpNumber = playerOne.trumpNumber + 2;
        } else if (playerOne.score >= 200) {
          newTrumpNumber = playerOne.trumpNumber + 3;
        }
      }
      playerOne.master = true;
      playerOne.trumpNumber = newTrumpNumber;
      playerThree.master = true;
      playerThree.trumpNumber = newTrumpNumber;
      playerTwo.master = false;
      playerFour.master = false;
    } else if (playerTwo.score > playerOne.score) {
      // team two has more points at the end
      if (playerTwo.master && playerFour.master) {
        if (existingGame.currentMaster === 'player_2') {
          newMaster = 'player_4';
          newStarter = 'player_4';
        } else if (existingGame.currentMaster === 'player_4') {
          newMaster = 'player_2';
          newStarter = 'player_2';
        }
        if (playerOne.score === 0) {
          // other team scored 0 points
          newTrumpNumber = playerOne.trumpNumber + 3;
        } else if (playerOne.score >= 5 && playerOne.score <= 35) {
          // other team scored between 5-35
          newTrumpNumber = playerOne.trumpNumber + 2;
        } else if (playerOne.score >= 40 && playerOne.score <= 75) {
          // other team scored between 40 and 75
          newTrumpNumber = playerOne.trumpNumber + 1;
        }
      } else {
        // set master to playerTwo/PlayerFour
        if (existingGame.currentMaster === 'player_1') {
          newMaster = 'player_2';
          newStarter = 'player_2';
        } else if (existingGame.currentMaster === 'player_3') {
          newMaster = 'player_4';
          newStarter = 'player_4';
        }
        if (playerTwo.score >= 120 && playerTwo.score <= 155) {
          newTrumpNumber = playerTwo.trumpNumber + 1;
        } else if (playerTwo.score >= 160 && playerTwo.Score <= 195) {
          newTrumpNumber = playerTwo.trumpNumber + 2;
        } else if (playerTwo.score >= 200) {
          newTrumpNumber = playerOne.trumpNumber + 3;
        }
      }
      playerOne.master = false;
      playerThree.master = false;
      playerTwo.master = true;
      playerTwo.trumpNumber = newTrumpNumber;
      playerFour.master = true;
      playerFour.trumpNumber = newTrumpNumber;
    } else {
      // both teams have exactly the same score
      // we want to change newMaster and newStarter.
      // when both teams have exact score,
      // we don't want to change anything just reset score, hand, and other game options.
      if (existingGame.currentMaster === 'player_1') {
        newMaster = 'player_3';
        newStarter = 'player_3';
      } else if (existingGame.currentMaster === 'player_2') {
        newMaster = 'player_4';
        newStarter = 'player_4';
      } else if (existingGame.currentMaster === 'player_3') {
        newMaster = 'player_1';
        newStarter = 'player_1';
      } else if (existingGame.currentMaster === 'player_4') {
        newMaster = 'player_2';
        newStarter = 'player_2';
      }
    }
    // we got a newStarter and newTrumpNumber, now we have to update the winning player's object
    // update deck
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
            trump: value === newTrumpNumber,
          });

          if (value === newTrumpNumber) {
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

    if (newTrumpNumber > 14) {
      gameStart = false;
    }

    existingGame.save();

    Game.model.findOneAndUpdate({ gameId }, { gameStart, round: newRound, pair: false, brokenTrump: false, trumpSuit: '', center: [], firstPlayed: [], revealedTrump: [], trumpNumber: newTrumpNumber, turn: newStarter, currentMaster: newMaster, }, { new: true }, (err, newGame) => {
      if (err) { return next(err); }

      if (!newGame) {
        return res.status(422).send({ error: 'Game does not exist' });
      }

      newGame.deck = newDeck;

      // update player score and player hands.
      newGame.player_1.score = 0;
      newGame.player_1.hand = [];

      newGame.player_2.score = 0;
      newGame.player_2.hand = [];

      newGame.player_3.score = 0;
      newGame.player_3.hand = [];

      newGame.player_4.score = 0;
      newGame.player_4.hand = [];

      newGame.save();

      res.json(newGame);
    });
  });
};
