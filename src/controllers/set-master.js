const Game = require('../models/game-model');
const helper = require('./helper-functions');
const _ = require('lodash');

module.exports = (req, res, next) => {
  const gameId = req.body.gameId;
  const currentUser = req.body.currentUser;
  const cards = req.body.cards;
  const pair = req.body.pair;

  Game.model.findOneAndUpdate({ gameId }, { pair, trumpSuit: cards[0].suit, revealedTrump: cards }, { new: true }, (err, existingGame) => {
    if (err) { return next(err); }

    if (!existingGame) {
      return res.status(422).send({ error: 'Game does not exist' });
    }

    const trumpSuit = cards[0].suit;

    const playerOne = existingGame.player_1;
    const playerTwo = existingGame.player_2;
    const playerThree = existingGame.player_3;
    const playerFour = existingGame.player_4;

    let newDeck = existingGame.deck;
    let newPlayerOneHand = playerOne.hand;
    let newPlayerTwoHand = playerTwo.hand;
    let newPlayerThreeHand = playerThree.hand;
    let newPlayerFourHand = playerFour.hand;

    // loops through the deck and each player's hand and
    // changes all cards of the revealed card's suit to trump
    // and everything else to non trump (except for Jokers and trump number)
    helper.changeToTrump(newDeck, trumpSuit, existingGame);
    helper.changeToTrump(newPlayerOneHand, trumpSuit, existingGame);
    helper.changeToTrump(newPlayerTwoHand, trumpSuit, existingGame);
    helper.changeToTrump(newPlayerThreeHand, trumpSuit, existingGame);
    helper.changeToTrump(newPlayerFourHand, trumpSuit, existingGame);

    // now all cards in the deck and player's hand are set to correct trumps.
    // want to combine them, sort them to original,
    // break them into trumps, and change the sortValue.
    const tempDeck = [];
    const tempHand1 = [];
    const tempHand2 = [];
    const tempHand3 = [];
    const tempHand4 = [];
    const tempCards = [];
    const tempTrumps = [];
    const tempTrumpSuits = [];
    const tempJokers = [];

    let sortValue = 0;
    const combineCards = newDeck.concat(newPlayerOneHand)
    .concat(newPlayerTwoHand).concat(newPlayerThreeHand).concat(newPlayerFourHand);
    const sortCombinedCards = _.orderBy(combineCards, ['sortValue'], ['asc']);
    for (let n = 0; n < sortCombinedCards.length; n += 1) {
      if (sortCombinedCards[n].name === 'Big Joker' || sortCombinedCards[n].name === 'Little Joker') {
        tempJokers.push(sortCombinedCards[n]);
      } else if (sortCombinedCards[n].trump
        && sortCombinedCards[n].value === existingGame.trumpNumber
        && sortCombinedCards[n].suit === trumpSuit) {
        tempTrumpSuits.push(sortCombinedCards[n]);
      } else if (sortCombinedCards[n].trump) {
        tempTrumps.push(sortCombinedCards[n]);
      } else {
        tempCards.push(sortCombinedCards[n]);
      }
    }
    for (let o = 0; o < tempCards.length; o += 1) {
      tempCards[o].sortValue = sortValue;
      if (o % 2 === 1) {
        sortValue += 1;
      }
    }
    for (let p = 0; p < tempTrumps.length; p += 1) {
      tempTrumps[p].sortValue = sortValue;
      if (p % 2 === 1) {
        sortValue += 1;
      }
    }
    for (let q = 0; q < tempTrumpSuits.length; q += 1) {
      tempTrumpSuits[q].sortValue = sortValue;
      if (q % 2 === 1) {
        sortValue += 1;
      }
    }
    for (let r = 0; r < tempJokers.length; r += 1) {
      tempJokers[r].sortValue = sortValue;
      if (r % 2 === 1) {
        sortValue += 1;
      }
    }

    // then we want to put them back in the each player's hand and deck.
    const tempFullCards = tempCards.concat(tempTrumps).concat(tempTrumpSuits).concat(tempJokers);
    for (let s = 0; s < tempFullCards.length; s += 1) {
      helper.pushBack(newPlayerOneHand, tempHand1, tempFullCards, s);
      helper.pushBack(newPlayerTwoHand, tempHand2, tempFullCards, s);
      helper.pushBack(newPlayerThreeHand, tempHand3, tempFullCards, s);
      helper.pushBack(newPlayerFourHand, tempHand4, tempFullCards, s);
      helper.pushBack(newDeck, tempDeck, tempFullCards, s);
    }

    // randomizes tempDeck
    helper.shuffleDeck(tempDeck);

    newDeck = tempDeck;
    newPlayerOneHand = tempHand1;
    newPlayerTwoHand = tempHand2;
    newPlayerThreeHand = tempHand3;
    newPlayerFourHand = tempHand4;

    const sortedNewOneHand = _.orderBy(newPlayerOneHand, ['sortValue'], ['desc']);
    const sortedNewTwoHand = _.orderBy(newPlayerTwoHand, ['sortValue'], ['desc']);
    const sortedNewThreeHand = _.orderBy(newPlayerThreeHand, ['sortValue'], ['desc']);
    const sortedNewFourHand = _.orderBy(newPlayerFourHand, ['sortValue'], ['desc']);

    let newMaster = existingGame.currentMaster;
    let playerOneMaster = false;
    let playerTwoMaster = false;
    let playerThreeMaster = false;
    let playerFourMaster = false;

    if (existingGame.round > 0) {
      playerOneMaster = playerOne.master;
      playerTwoMaster = playerTwo.master;
      playerThreeMaster = playerThree.master;
      playerFourMaster = playerFour.master;
    } else if (playerOne.playerName === currentUser || playerThree.playerName === currentUser) {
      playerOneMaster = true;
      playerThreeMaster = true;
      if (playerOne.playerName === currentUser) {
        newMaster = playerOne.player;
      } else {
        newMaster = playerThree.player;
      }
    } else if (playerTwo.playerName === currentUser || playerFour.playerName === currentUser) {
      playerTwoMaster = true;
      playerFourMaster = true;
      if (playerTwo.playerName === currentUser) {
        newMaster = playerTwo.player;
      } else {
        newMaster = playerFour.player;
      }
    }

    playerOne.master = playerOneMaster;
    playerOne.hand = sortedNewOneHand;
    playerTwo.master = playerTwoMaster;
    playerTwo.hand = sortedNewTwoHand;
    playerThree.master = playerThreeMaster;
    playerThree.hand = sortedNewThreeHand;
    playerFour.master = playerFourMaster;
    playerFour.hand = sortedNewFourHand;

    existingGame.deck = newDeck;
    existingGame.currentMaster = newMaster;

    existingGame.save();

    res.json(existingGame);
  });
};
