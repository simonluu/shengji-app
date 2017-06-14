const Game = require('../models/game-model');
const helper = require('./helper-functions');

module.exports = (req, res, next) => {
  const gameId = req.body.gameId;

  Game.model.findOneAndUpdate({ gameId }, { firstPlayed: [], turnNumber: 0 }, { new: true }, (err, existingGame) => {
    if (err) { return next(err); }

    if (!existingGame) {
      return res.status(422).send({ error: 'Game does not exist' });
    }

    const center = existingGame.center;
    let roundScore = 0;
    let winner = '';
    let pair = false;
    // grabs the first hand, played by the first player.
    const firstHand = [];
    for (let i = 0; i < center.length / 4; i += 1) {
      firstHand.push(center[i]);
    }
    let winningHand = [];
    // determine the kind of hand played, i.e 1 card, pair, shuai, tuolaji
    if (firstHand.length === 1) {
      // played a card.
      // loop through other hands to determine winner.
      winningHand.push(firstHand[0]);
      for (let j = 1; j < center.length; j += 1) {
        if (winningHand[0].trump && center[j].trump) {
          if ((winningHand[0].name === 'Little Joker' && center[j].name === 'Big Joker')
            || ((winningHand[0].value === existingGame.trumpNumber
              && winningHand[0].suit === existingGame.trumpSuit)
              && (center[j].name === 'Big Joker' || center[j].name === 'Little Joker'))
            || ((winningHand[0].value === existingGame.trumpNumber
              && center[j].value === existingGame.trumpNumber
              && center[j].suit === existingGame.trumpSuit)
            || center[j].name === 'Little Joker'
            || center[j].name === 'Big Joker')
            || (winningHand[0].suit === existingGame.trumpSuit
              && center[j].sortValue > winningHand[0].sortValue)) {
            winningHand = [];
            winningHand.push(center[j]);
          }
        } else if (!winningHand[0].trump && center[j].trump) {
          // firstHand[0] is not trump
          // automatically center[j] should be set as new winning hand
          // since trump > non trumps
          winningHand = [];
          winningHand.push(center[j]);
        } else if (!winningHand[0].trump && !center[j].trump) {
          // neither cards are trump
          // the only way center[j] wins is if they are the same suit and sortValue > sortValue
          if (winningHand[0].suit === center[j].suit
            && center[j].sortValue > winningHand[0].sortValue) {
            winningHand = [];
            winningHand.push(center[j]);
          }
        }
      }
    } else if (firstHand.length === 2) {
      // could be pair or two card shuai
      // push both cards into winningHand.
      winningHand.push(firstHand[0]);
      winningHand.push(firstHand[1]);
      // [ 2s 2s 3s 3s 4s 4s 5s 5s ]
      if (winningHand[0].name === winningHand[1].name
        && winningHand[0].suit === winningHand[1].suit) {
        // both cards in hand are the same, so firstHand was a pair
        // loop through center
        pair = true;
        for (let j = 2; j < center.length; j += 2) {
          if (center[j].name === center[j + 1].name && center[j].suit === center[j + 1].suit) {
            // both cards are the same
            if (winningHand[0].trump && center[j].trump) {
              if ((winningHand[0].name === 'Little Joker' && center[j].name === 'Big Joker')
                || ((winningHand[0].value === existingGame.trumpNumber
                  && winningHand[0].suit === existingGame.trumpSuit)
                  && (center[j].name === 'Big Joker' || center[j].name === 'Little Joker'))
                || ((winningHand[0].value === existingGame.trumpNumber
                  && center[j].value === existingGame.trumpNumber
                  && center[j].suit === existingGame.trumpSuit)
                || center[j].name === 'Little Joker' || center[j].name === 'Big Joker')
                || (winningHand[0].suit === existingGame.trumpSuit
                  && center[j].sortValue > winningHand[0].sortValue)) {
                winningHand = [];
                winningHand.push(center[j]);
                winningHand.push(center[j + 1]);
              }
            } else if (!winningHand[0].trump && center[j].trump) {
              winningHand = [];
              winningHand.push(center[j]);
              winningHand.push(center[j + 1]);
            } else if (!winningHand[0].trump && !center[j].trump) {
              if (winningHand[0].suit === center[j].suit
                && center[j].sortValue > winningHand[0].sortValue) {
                winningHand = [];
                winningHand.push(center[j]);
                winningHand.push(center[j + 1]);
              }
            }
          }
        }
      } else if (winningHand[0].suit === winningHand[1].suit) {
        // both cards are same suit, 2 card shuai
        // If a shuai runs, then nobody has a card higher than the lowest...
        // that means that the only way to beat a shuai is if a trump is played.
        for (let j = 2; j < center.length; j += 1) {
          if (winningHand[0].trump) {
            if (center[j].trump && center[j + 1].trump
              && center[j].sortValue > winningHand[0].sortValue) {
              winningHand = [];
              winningHand.push(center[j]);
              winningHand.push(center[j + 1]);
            }
          } else if (center[j].trump && center[j + 1].trump) {
            winningHand = [];
            winningHand.push(center[j]);
            winningHand.push(center[j + 1]);
          }
        }
      }
    } else if (firstHand.length > 2) {
      // shuai or tuolaji
      // loop through firstHand to figure out if shuai or tuolaji
      pair = true;
      for (let x = 0; x < firstHand.length; x += 1) {
        winningHand.push(firstHand[x]);
      }
      // split each hand
      const handTwo = [];
      const handThree = [];
      const handFour = [];
      for (let a = firstHand.length; a < center.length / 4; a += 1) {
        handTwo.push(center[a]);
      }
      const twoHandLength = firstHand.length + handTwo.length;
      for (let b = twoHandLength; b < center.length / 4; b += 1) {
        handThree.push(center[b]);
      }
      const threeHandLength = firstHand.length + handTwo.length + handThree.length;
      for (let c = threeHandLength; c < center.length / 4; c += 1) {
        handFour.push(center[c]);
      }

      const firstHandTS = helper.checkTuolajiShuai(firstHand, existingGame);

      // loops through each hand.
      for (let d = 1; d < center.length / 4; d += 1) {
        if (d === 1) {
          // check handtwo
          if (firstHandTS === 'Tuolaji') {
            // hand one is a tuolaji, check if hand two is tuolaji
            if (helper.checkTuolajiShuai(handTwo, existingGame) === 'Tuolaji') {
              let higherHand = true;
              if (handTwo[0].suit === winningHand[0].suit
                && handTwo[0].sortValue < winningHand[0].sortValue) {
                higherHand = false;
              }
              if (higherHand) {
                winningHand = handTwo;
              }
            }
          } else if (firstHandTS === 'Shuai') {
            if (helper.checkTuolajiShuai(handTwo, existingGame) === 'Shaui') {
              if (handTwo[0].suit === winningHand[0].suit
                && handTwo[0].trump && handTwo[0].sortValue > winningHand[0].sortValue) {
                winningHand = handTwo;
              }
            }
          }
        } else if (d === 2) {
          // check handthree
          if (firstHandTS === 'Tuolaji') {
            // hand one is a tuolaji, check if hand two is tuolaji
            if (helper.checkTuolajiShuai(handThree, existingGame) === 'Tuolaji') {
              let higherHand = true;
              if (handThree[0].suit === winningHand[0].suit
                && handThree[0].sortValue < winningHand[0].sortValue) {
                higherHand = false;
              }
              if (higherHand) {
                winningHand = handThree;
              }
            }
          } else if (firstHandTS === 'Shuai') {
            if (helper.checkTuolajiShuai(handThree, existingGame) === 'Shaui') {
              if (handThree[0].suit === winningHand[0].suit
                && handThree[0].trump && handThree[0].sortValue > winningHand[0].sortValue) {
                winningHand = handThree;
              }
            }
          }
        } else if (d === 3) {
          // check handfour
          if (firstHandTS === 'Tuolaji') {
            // hand one is a tuolaji, check if hand two is tuolaji
            if (helper.checkTuolajiShuai(handFour, existingGame) === 'Tuolaji') {
              let higherHand = true;
              if (handFour[0].suit === winningHand[0].suit
                && handFour[0].sortValue < winningHand[0].sortValue) {
                higherHand = false;
              }
              if (higherHand) {
                winningHand = handFour;
              }
            }
          } else if (firstHandTS === 'Shuai') {
            if (helper.checkTuolajiShuai(handFour, existingGame) === 'Shaui') {
              if (handFour[0].suit === winningHand[0].suit
                && handFour[0].trump && handFour[0].sortValue > winningHand[0].sortValue) {
                winningHand = handFour;
              }
            }
          }
        }
      }
    }

    // we found the winning hand, so get the player that won.
    winner = winningHand[0].playedBy;

    // score the entire hand
    for (let k = 0; k < center.length; k += 1) {
      if (center[k].value === 5) {
        roundScore += 5;
      } else if (center[k].value === 10 || center[k].value === 13) {
        roundScore += 10;
      }
    }

    // if there are no cards in all player's hand calculate points from di pai
    if (!existingGame[winner].master) {
      if (existingGame.player_1.hand.length === 0
        && existingGame.player_2.hand.length === 0
        && existingGame.player_3.hand.length === 0
        && existingGame.player_4.hand.length === 0) {
        for (let x = 0; x < existingGame.deck.length; x += 1) {
          if (existingGame.deck[x].value === 5) {
            if (pair) {
              roundScore += (5 * 4);
            } else {
              roundScore += (5 * 2);
            }
          } else if (existingGame.deck[x].value === 10 || existingGame.deck[x].value === 13) {
            if (pair) {
              roundScore += (10 * 4);
            } else {
              roundScore += (10 * 2);
            }
          }
        }
      }
    }

    let teamOneScore = existingGame.player_1.score;
    let teamTwoScore = existingGame.player_2.score;

    if (existingGame[winner].team === '1') {
      teamOneScore += roundScore;
    } else if (existingGame[winner].team === '2') {
      teamTwoScore += roundScore;
    }

    existingGame.player_1.score = teamOneScore;
    existingGame.player_2.score = teamTwoScore;
    existingGame.player_3.score = teamOneScore;
    existingGame.player_4.score = teamTwoScore;

    existingGame.turn = winner;
    existingGame.center = [];

    existingGame.save();

    res.json(existingGame);
  });
};
