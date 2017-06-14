import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import _ from 'lodash';

import * as actions from '../actions';

import CardHolder from '../components/card-holder';
import Card from './card';

// IF A BIG JOKER HAS BEEN PLAYED THE NEXT BIG JOKER DOES NOT WIN.
// Features to implement:
// 1. on refresh reconnect to socket.io
// 3. update UI

class Game extends Component {
  constructor(props) {
    super(props);

    this.state = {
      phaseTimer: null,
      counter: 5,
    };

    this.drawCard = this.drawCard.bind(this);
    this.getCurrentUser = this.getCurrentUser.bind(this);
    this.getUser = this.getUser.bind(this);
    this.onRevealTrumpClick = this.onRevealTrumpClick.bind(this);
    this.drawToSwapPhase = this.drawToSwapPhase.bind(this);
    this.setCountdown = this.setCountdown.bind(this);
    this.renderRevealedCards = this.renderRevealedCards.bind(this);
    this.renderMiddleCards = this.renderMiddleCards.bind(this);
    this.renderCenterCards = this.renderCenterCards.bind(this);
    this.renderTrumpSuit = this.renderTrumpSuit.bind(this);
    this.swapCardsClick = this.swapCardsClick.bind(this);
    this.playCardsClick = this.playCardsClick.bind(this);
  }

  // component life cycles
  componentDidUpdate() {
    // just played fourth card
    if (this.props.gameInfo.currentMaster !== '' && this.props.gameInfo[this.props.gameInfo.currentMaster].playerName === sessionStorage.currentUser && this.props.phase === 'playPhase' && this.props.gameInfo.turnNumber === 4) {
      this.props.phaseEnd(this.props.gameInfo.gameId);

      if (this.props.gameInfo.player_1.hand.length === 0 && this.props.gameInfo.player_2.hand.length === 0 && this.props.gameInfo.player_3.hand.length === 0 && this.props.gameInfo.player_4.hand.length === 0) {
        this.props.restartRound(this.props.gameInfo.gameId);
        if (this.props.gameInfo[this.props.gameInfo.currentMaster].playerName === sessionStorage.currentUser) {
          this.props.changePhase(this.props.gameInfo.gameId, 'drawPhase');
        }
      }
    }
    if (this.props.phase === 'drawPhase' && this.props.gameInfo.deck.length === 8 && this.props.gameInfo.player_1.hand.length !== 0 && this.props.gameInfo.player_2.hand.length !== 0 && this.props.gameInfo.player_3.hand.length !== 0 && this.props.gameInfo.player_4.hand.length !== 0 && this.state.phaseTimer === null) {
      this.drawToSwapPhase();
    }
    // this should end the game when trump number goes of Ace
    if (this.props.gameInfo.trumpNumber > 14) {
      if (this.props.gameInfo[this.props.gameInfo.currentMaster].playerName === sessionStorage.currentUser) {
        this.props.deleteGame(this.props.gameInfo.gameId);
      }
      this.context.router.push('/game-over');
    }
  }

  // game onclick handles
  drawCard() {
    if (this.props.gameInfo.deck.length > 8 && this.props.phase === 'drawPhase') {
      if (this.props.gameInfo[this.props.gameInfo.turn].playerName === sessionStorage.currentUser) {
        this.props.addCardToHand(
          this.props.gameInfo.gameId,
          this.props.gameInfo.turn,
          this.props.gameInfo.deck[this.props.gameInfo.deck.length - 1],
        );
      }
    }
  }

  onRevealTrumpClick() {
    if (this.props.phase === 'drawPhase') {
      const gameId = this.props.gameInfo.gameId;
      if (this.props.gameInfo.revealedTrump.length === 0) {
        if (this.props.selectedCards.length === 1) {
          const selectedOne = this.props.selectedCards[0];
          if (selectedOne.value === this.props.gameInfo.trumpNumber) {
            // call setMaster
            this.props.setNewMaster(gameId, sessionStorage.currentUser, [selectedOne], false);
          } else {
            console.log('ERROR THE ONE CARD IS NOT A TRUMP NUMBER');
          }
        } else if (this.props.selectedCards.length === 2) {
          const selectedOne = this.props.selectedCards[0];
          const selectedTwo = this.props.selectedCards[1];
          if (selectedOne.name === selectedTwo.name && selectedOne.suit === selectedTwo.suit) {
            if (selectedOne.value === this.props.gameInfo.trumpNumber || selectedOne.suit === 'Wild') {
              this.props.setNewMaster(
                gameId,
                sessionStorage.currentUser,
                [selectedOne, selectedTwo],
                true,
              );
            } else {
              console.log('ERROR THE TWO CARDS GIVEN ARE NOT TRUMP');
            }
          } else {
            console.log('ERROR THE TWO CARDS ARE NOT THE SAME');
          }
        } else {
          console.log('INVALID CARD SELECTION, CHOSE NO CARDS OR TOO MANY CARDS');
        }
      } else {
        if (this.props.selectedCards.length === 2) {
          const selectedOne = this.props.selectedCards[0];
          const selectedTwo = this.props.selectedCards[1];
          if (selectedOne.name === selectedTwo.name && selectedOne.suit === selectedTwo.suit) {
            if (this.props.gameInfo.revealedTrump.length === 1) {
              if (selectedOne.value === this.props.gameInfo.trumpNumber || selectedOne.suit === 'Wild') {
                this.props.setNewMaster(
                  gameId,
                  sessionStorage.currentUser,
                  [selectedOne, selectedTwo],
                  true,
                );
              } else {
                console.log('ERROR THE TWO CARDS GIVEN ARE NOT TRUMP');
              }
            } else {
              // already revealed pair,
              if (selectedOne.sortValue > this.props.gameInfo.revealedTrump[0].sortValue) {
                this.props.setNewMaster(
                  gameId,
                  sessionStorage.currentUser,
                  [selectedOne, selectedTwo],
                  true,
                );
              } else {
                console.log('ERROR YOU PLAYED CARDS LOWER THAN REVEALED CARDS');
              }
            }
          } else {
            console.log('ERROR TWO CARDS ARE NOT THE SAME');
          }
        } else {
          console.log('You tried to reveal a one card trump, but a one card trump has already been revealed. Or you tried to reveal more than 2 cards.');
        }
      }
      this.props.emptySelectedCard();
    }
  }

  swapCardsClick() {
    if (this.props.selectedCards.length === this.props.swapCards.length) {
      this.props.swapCard(
        this.props.gameInfo.gameId,
        this.props.swapCards,
        this.props.selectedCards,
      );
      this.props.changePhase(this.props.gameInfo.gameId, 'playPhase');
    }
    this.props.emptySelectedCard();
    this.props.emptySwapCard();
  }

  playCardsClick() {
    const gameId = this.props.gameInfo.gameId;
    const sortedSelectedCards = _.orderBy(this.props.selectedCards, ['sortValue'], ['desc']);
    // firstPlayed.length === 0 means nobody has played yet, this player is starting.
    if (this.props.gameInfo.firstPlayed.length === 0) {
      // If selectedCards.length === 1 Then they only played one card
      // else selectedCards.length > 1 means they either played a pair, shuai, or Tuolaji
      if (sortedSelectedCards.length === 1) {
        // Only played one Card
        // We must check if the card played is trump.
        const card = sortedSelectedCards[0];
        if (card.trump) {
          // Card played is trump check if trump has been broken
          if (this.props.gameInfo.brokenTrump) {
            // Trump has been broken thus is playable
            console.log('Played One Card Successfully');
            this.props.playCard(gameId, sortedSelectedCards);
          } else {
            // Trump has not been broken thus not playable
            console.log('This card is not playable since trump has not been broken');
          }
        } else {
          // Card played is not trump, thus is always first playable
          console.log('Played One Card Successfully');
          this.props.playCard(gameId, sortedSelectedCards);
        }
      } else if (sortedSelectedCards.length === 2) {
        // Played either a pair, or two card shuai.
        const cardOne = sortedSelectedCards[0];
        const cardTwo = sortedSelectedCards[1];
        if (cardOne.name === cardTwo.name && cardOne.suit === cardTwo.suit) {
          // They played a pair, both cards are the same
          if (cardOne.trump) {
            if (this.props.gameInfo.brokenTrump) {
              // Trump has been broken so playable
              console.log('Played Two Cards Successfully');
              this.props.playCard(gameId, sortedSelectedCards);
            } else {
              // Do nothing since trump has not been broken
              console.log('These cards are not playable since trump has not been broken');
            }
          } else {
            // Always playable since not trump
            console.log('Played Two Cards Successfully');
            this.props.playCard(gameId, sortedSelectedCards);
          }
        } else if (cardOne.suit === cardTwo.suit) {
          // They played a two card shuai
          // check if the shuai runs.
          const players = ['player_1', 'player_2', 'player_3', 'player_4'];
          let run = true;
          for (let i = 0; i < players.length; i += 1) {
            if (this.props.gameInfo.turn !== players[i]) {
              const playerHand = this.props.gameInfo[players[i]].hand;
              for (let j = 0; j < playerHand.length; j += 1) {
                if (playerHand[j].suit === cardTwo.suit && playerHand[j].value > cardTwo.value) {
                  run = false;
                }
              }
            }
          }
          // Same suit, so if one is a trump, the other is trump
          if (cardOne.trump) {
            if (this.props.gameInfo.brokenTrump) {
              if (run) {
                console.log('Played Two Card Shuai Successfully');
                this.props.playCard(gameId, sortedSelectedCards);
              } else {
                console.log('Played Two Card Shuai that does not run');
                this.props.playCard(gameId, [cardTwo]);
              }
            } else {
              // Do nothing since trump has not been broken
              console.log('These cards are not playable since trump has not been broken');
            }
          } else {
            // Always playable since not trump
            if (run) {
              console.log('Played Two Card Shuai Successfully');
              this.props.playCard(gameId, sortedSelectedCards);
            } else {
              console.log('Played Two Card Shuai that does not run');
              this.props.playCard(gameId, [cardTwo]);
            }
          }
        } else {
          // Cards played not pair or two card shuai.
          console.log('Played cards not pair or shuai, invalid card play');
        }
      } else if (sortedSelectedCards.length > 2) {
        // Played either a shuai, or Tuolaji
        /* Here begins repeated Code */
        let isTuolaji = true;
        let isShuai = true;
        let isPair = true;
        for (let i = 0; i < sortedSelectedCards.length - 1; i += 1) {
          if (sortedSelectedCards[i].name === sortedSelectedCards[i + 1].name
            && sortedSelectedCards[i].suit === sortedSelectedCards[i + 1].suit) {
            i += 1;
          } else {
            isTuolaji = false;
            isPair = false;
            break;
          }
        }
        if (isTuolaji && isShuai) {
          for (let j = 0; j < sortedSelectedCards.length - 2; j += 2) {
            if (!sortedSelectedCards[j].trump) {
              if (sortedSelectedCards[j].sortValue - 1 !== sortedSelectedCards[j + 2].sortValue) {
                isTuolaji = false;
                break;
              }
            } else {
              // Checks if the currentCard and next card are consecutives.
              if (this.props.gameInfo.trumpSuit !== '' || this.props.gameInfo.trumpSuit !== 'Wild') {
                if (sortedSelectedCards[j].name === 'Big Joker' && sortedSelectedCards[j + 2].name !== 'Little Joker') {
                  // If Big Joker, check if next is Little Joker.
                  isTuolaji = false;
                  break;
                } else if (sortedSelectedCards[j].name === 'Little Joker' && sortedSelectedCards[j + 2].value !== this.props.gameInfo.trumpNumber) {
                  // If Little Joker, check if next is a trump number
                  isTuolaji = false;
                  break;
                } else if (sortedSelectedCards[j].value === this.props.gameInfo.trumpNumber && sortedSelectedCards[j + 2].value !== this.props.gameInfo.trumpNumber) {
                  // If trump number, check if next is a trump number
                  isTuolaji = false;
                  break;
                }
              } else {
                if (sortedSelectedCards[j].name === 'Big Joker' && sortedSelectedCards[j + 2].name !== 'Little Joker') {
                  // If Big Joker, check if next is Little Joker.
                  isTuolaji = false;
                  break;
                } else if (sortedSelectedCards[j].name === 'Little Joker' && sortedSelectedCards[j + 2].value !== this.props.gameInfo.trumpNumber && sortedSelectedCards[j + 2].suit !== this.props.gameInfo.trumpSuit) {
                  // If Little Joker, check if next is a trump number and suit
                  isTuolaji = false;
                  break;
                } else if (sortedSelectedCards[j].value === this.props.gameInfo.trumpNumber && sortedSelectedCards[j].suit === this.props.gameInfo.trumpSuit && sortedSelectedCards[j + 2].value !== this.props.gameInfo.trumpNumber) {
                  // If trump number and suit, check if next is a trump number
                  isTuolaji = false;
                  break;
                } else if (sortedSelectedCards[j].value === this.props.gameInfo.trumpNumber && sortedSelectedCards[j + 2].value !== this.props.gameInfo.trumpNumber) {
                  // If trump number, check if next is trump number
                  isTuolaji = false;
                  break;
                } else if (sortedSelectedCards[j].value === this.props.gameInfo.trumpNumber && sortedSelectedCards[j + 2].sortValue !== 47) {
                  // If trump number, check if next is trump Ace
                  isTuolaji = false;
                  break;
                } else if (sortedSelectedCards[j].sortValue - 1 !== sortedSelectedCards[j + 2]) {
                  // In here means, you are not Big Joker, Little Joker, Trump Number + Suit, or Trump Number.
                  isTuolaji = false;
                  break;
                }
              }
            }
          }
          if (isTuolaji) {
            isShuai = false;
          } else {
            // it is not a Tuolaji, so check if it is a shuai
            // need to check if it really is a shuai, this one is checking pairs
            for (let k = 0; k < sortedSelectedCards.length - 1; k += 1) {
              if (sortedSelectedCards[k].suit !== sortedSelectedCards[k + 1].suit || (sortedSelectedCards[k].trump && !sortedSelectedCards[k + 1].trump)) {
                isShuai = false;
                break;
              }
            }
          }
        } else if (!isTuolaji && isShuai) {
          // It is not a Tuolaji, so it must be shuai.
          // check if it really is a shuai, this one is check non pairs
          for (let l = 0; l < sortedSelectedCards.length - 1; l += 1) {
            if (sortedSelectedCards[l].suit !== sortedSelectedCards[l + 1].suit || (sortedSelectedCards[l].trump && !sortedSelectedCards[l + 1].trump)) {
              isShuai = false;
              break;
            }
          }
        }
        /* Here ends repeated Code */

        if (isTuolaji) {
          // all the cards should be the same suit, so if one is trump the rest is trump
          if (sortedSelectedCards[0].trump) {
            if (this.props.gameInfo.brokenTrump) {
              // Trump is broken thus playable
              console.log('Played a Tuolaji');
              this.props.playCard(gameId, sortedSelectedCards);
            } else {
              // Trump is not broken
              console.log('These cards are not playable since trump has not been broken');
            }
          } else {
            // Always playable
            console.log('Played a Tuolaji');
            this.props.playCard(gameId, sortedSelectedCards);
          }
        } else if (isShuai) {
          // need to check if the Shuai runs.
          const players = ['player_1', 'player_2', 'player_3', 'player_4'];
          const lowestCard = sortedSelectedCards[sortedSelectedCards.length - 1];
          let run = true;
          for (let m = 0; m < players.length; m += 1) {
            if (this.props.gameInfo.turn !== players[m]) {
              const playerHand = this.props.gameInfo[players[m]].hand;
              if (isPair) {
                for (let n = 0; n < playerHand.length - 1; n += 1) {
                  if (playerHand[n].name === playerHand[n + 1].name && (playerHand[n].suit === playerHand[n + 1].suit || (playerHand[n].trump && playerHand[n + 1].trump))) {
                    if ((playerHand[n].suit === lowestCard.suit || (playerHand[n].trump && lowestCard.trump)) && playerHand[n].sortValue > lowestCard.sortValue) {
                      run = false;
                      break;
                    }
                  }
                }
              } else {
                for (let n = 0; n < playerHand.length; n += 1) {
                  if ((playerHand[n].suit === lowestCard.suit || (playerHand[n].trump && lowestCard.trump)) && playerHand[n].sortValue > lowestCard.sortValue) {
                    run = false;
                    break;
                  }
                }
              }
            }
          }
          if (sortedSelectedCards[0].trump) {
            if (this.props.gameInfo.brokenTrump) {
              // Trump has been broken, thus playable
              if (run) {
                console.log('Played a Shuai that runs');
                this.props.playCard(gameId, sortedSelectedCards);
              } else {
                if (isPair) {
                  console.log('Played a pair shuai that does not run');
                  this.props.playCard(gameId, [sortedSelectedCards[sortedSelectedCards.length - 2], sortedSelectedCards[sortedSelectedCards.length - 1]]);
                } else {
                  console.log('Played a Shuai that does not run');
                  this.props.playCard(gameId, [sortedSelectedCards[sortedSelectedCards.length - 1]]);
                }
              }
            } else {
              // Not playable since trump not broken
              console.log('This hand is not playable since trump has not been broken');
            }
          } else {
            // always playable since not trump
            if (run) {
              console.log('Played a Shuai that runs');
              this.props.playCard(gameId, sortedSelectedCards);
            } else {
              if (isPair) {
                console.log('Played a pair shuai that does not run');
                this.props.playCard(gameId, [sortedSelectedCards[sortedSelectedCards.length - 2], sortedSelectedCards[sortedSelectedCards.length - 1]]);
              } else {
                console.log('Played a Shuai that does not run');
                this.props.playCard(gameId, [sortedSelectedCards[sortedSelectedCards.length - 1]]);
              }
            }
          }
        } else {
          // Neither Tuolaji or Shuai
          console.log('You played neither a Tuolaji or Shuai');
        }
      } else {
        // Played 0 cards error them
        console.log('Error you selected 0 cards');
      }
    } else {
      // someone has played already
      // players must follow in suit if they can
      const currentPlayer = this.props.gameInfo.turn;
      const firstPlayed = this.props.gameInfo.firstPlayed;
      const currentPlayerHand = this.props.gameInfo[currentPlayer].hand;
      // these are cards that must be played. i.e pairs that must be played
      const mustPlay = [];
      // these are the rest of the cards that are playable in the same suit.
      const playable = [];
      // playable pairs for Tuolajis
      const pairPlayable = [];
      if (sortedSelectedCards.length === firstPlayed.length) {
        // These if statements should gather all the playable cards in the player's hand.
        if (sortedSelectedCards.length === 1) {
          // played one card
          for (let i = 0; i < currentPlayerHand.length; i += 1) {
            if ((firstPlayed[0].trump && currentPlayerHand[i].trump) || (!firstPlayed[0].trump && !currentPlayerHand[i].trump && currentPlayerHand[i].suit === firstPlayed[0].suit)) {
              playable.push(currentPlayerHand[i]);
            }
          }
          const beforeLength = playable.length;
          for (let j = 0; j < playable.length; j += 1) {
            if (_.isEqual(sortedSelectedCards[0], playable[j])) {
              const playedCard = playable.find((card) => {
                return card.name === sortedSelectedCards[0].name && card.suit === sortedSelectedCards[0].suit && card.unique === sortedSelectedCards[0].unique;
              });
              const index = playable.indexOf(playedCard);
              playable.splice(index, 1);
            }
          }
          if (beforeLength - playable.length === 1 || beforeLength === 0) {
            this.props.playCard(gameId, sortedSelectedCards);
          } else {
            console.log('You played a card that is a trump or is not the same suit');
          }
        } else if (sortedSelectedCards.length === 2) {
          // played two cards, could be a pair or 2 card shuai.
          const firstCard = firstPlayed[0];
          const secondCard = firstPlayed[1];
          if (firstCard.name === secondCard.name && firstCard.suit === secondCard.suit) {
            // this means it is a pair
            for (let i = 0; i < currentPlayerHand.length; i += 1) {
              const currentHandCard = currentPlayerHand[i];
              if (currentPlayerHand[i + 1] !== undefined) {
                const nextHandCard = currentPlayerHand[i + 1];
                if ((firstCard.trump && currentHandCard.trump) || (!firstCard.trump && !currentHandCard.trump && currentHandCard.suit === firstCard.suit)) {
                  if (currentHandCard.name === nextHandCard.name && currentHandCard.suit === nextHandCard.suit) {
                    mustPlay.push(currentHandCard);
                    mustPlay.push(nextHandCard);
                    i += 1;
                  } else {
                    playable.push(currentHandCard);
                  }
                }
              } else {
                // last card
                if ((firstCard.trump && currentHandCard.trump) || (!firstCard.trump && !currentHandCard.trump && currentHandCard.suit === firstCard.suit)) {
                  playable.push(currentHandCard);
                }
              }
            }
            const beforeMustPlay = mustPlay.length;
            const beforePlayable = playable.length;
            if (beforeMustPlay !== 0) {
              // you own atleast one pair so loop through to remove those pairs
              for (let j = 0; j < mustPlay.length; j += 1) {
                for (let k = 0; k < sortedSelectedCards.length; k += 1) {
                  if (_.isEqual(sortedSelectedCards[k], mustPlay[j])) {
                    const playedCard = mustPlay.find((card) => {
                      return card.name === sortedSelectedCards[k].name && card.suit === sortedSelectedCards[k].suit && card.unique === sortedSelectedCards[k].unique;
                    });

                    const index = mustPlay.indexOf(playedCard);
                    mustPlay.splice(index, 1);
                  }
                }
              }
            } else if (beforePlayable !== 0) {
              // you own no pairs, but cards of the trump suit
              for (let j = 0; j < playable.length; j += 1) {
                for (let k = 0; k < sortedSelectedCards.length; k += 1) {
                  if (_.isEqual(sortedSelectedCards[k], playable[j])) {
                    const playedCard = playable.find((card) => {
                      return card.name === sortedSelectedCards[k].name && card.suit === sortedSelectedCards[k].suit && card.unique === sortedSelectedCards[k].unique;
                    });

                    const index = playable.indexOf(playedCard);
                    playable.splice(index, 1);
                  }
                }
              }
            }

            if (beforeMustPlay !== 0 && beforeMustPlay - mustPlay.length === 2) {
              // you had atleast 1 pair, and you played 1 pair
              this.props.playCard(gameId, sortedSelectedCards);
            } else if (beforeMustPlay === 0 && beforePlayable !== 0 && (beforePlayable - playable.length === 2 || playable.length === 0)) {
              // you had no pairs but cards of that suit, you played two cards of that suit
              // or you played all of your suit and another random card.
              this.props.playCard(gameId, sortedSelectedCards);
            } else if (beforeMustPlay === 0 && beforePlayable === 0) {
              // you had no cards of any that suit
              this.props.playCard(gameId, sortedSelectedCards);
            } else {
              console.log('You must play pairs if you have pairs, otherwise you must play cards of the same suit. Then you may play whatever you want.');
            }
          } else if (firstCard.suit === secondCard.suit) {
            // 2 card shuai
            // check all cards in hands for the same suit as firstCard
            for (let i = 0; i < currentPlayerHand.length; i += 1) {
              if ((firstCard.trump && currentPlayerHand[i].trump) || (!firstCard.trump && !currentPlayerHand[i].trump && currentPlayerHand[i].suit === firstCard.suit)) {
                playable.push(currentPlayerHand[i]);
              }
            }
            const beforeLength = playable.length;
            for (let j = 0; j < playable.length; j += 1) {
              for (let k = 0; k < sortedSelectedCards.length; k += 1) {
                if (_.isEqual(sortedSelectedCards[k], playable[j])) {
                  const playedCard = playable.find((card) => {
                    return card.name === sortedSelectedCards[k].name && card.suit === sortedSelectedCards[k].suit && card.unique === sortedSelectedCards[k].unique;
                  });
                  const index = playable.indexOf(playedCard);
                  playable.splice(index, 1);
                }
              }
            }
            if (beforeLength - playable.length === 2 || playable.length === 0) {
              this.props.playCard(gameId, sortedSelectedCards);
            } else if (beforeLength - playable.length === 1) {
              console.log('You played two cards one with same suit, other is not same suit.');
            } else {
              console.log('You played two cards that are not the same suit as the first played.');
            }
          } else {
            console.log('You played neither a pair or 2 card shuai.');
          }
        } else if (sortedSelectedCards.length > 2) {
          // when length is > 2 it could be a shuai or Tuolaji.
          // determine if firstPlayed is a Tuolaji or shuai.
          /* Here begins repeated Code */
          let isTuolaji = true;
          let isShuai = true;
          let isPair = true;
          for (let i = 0; i < firstPlayed.length - 1; i += 1) {
            if (firstPlayed[i].name === firstPlayed[i + 1].name && firstPlayed[i].suit === firstPlayed[i + 1].suit) {
              i += 1;
            } else {
              isTuolaji = false;
              isPair = false;
              break;
            }
          }
          if (isTuolaji && isShuai) {
            for (let j = 0; j < firstPlayed.length - 2; j += 2) {
              if (!firstPlayed[j].trump) {
                if (firstPlayed[j].sortValue - 1 !== firstPlayed[j + 2].sortValue) {
                  isTuolaji = false;
                  break;
                }
              } else {
                // THIS NEEDS TO BE TESTED
                if (this.props.gameInfo.trumpSuit !== '' || this.props.gameInfo.trumpSuit !== 'Wild') {
                  if (sortedSelectedCards[j].name === 'Big Joker' && sortedSelectedCards[j + 2].name !== 'Little Joker') {
                    // If Big Joker, check if next is Little Joker.
                    isTuolaji = false;
                    break;
                  } else if (sortedSelectedCards[j].name === 'Little Joker' && sortedSelectedCards[j + 2].value !== this.props.gameInfo.trumpNumber) {
                    // If Little Joker, check if next is a trump number
                    isTuolaji = false;
                    break;
                  } else if (sortedSelectedCards[j].value === this.props.gameInfo.trumpNumber && sortedSelectedCards[j + 2].value !== this.props.gameInfo.trumpNumber) {
                    // If trump number, check if next is a trump number
                    isTuolaji = false;
                    break;
                  }
                } else {
                  if (sortedSelectedCards[j].name === 'Big Joker' && sortedSelectedCards[j + 2].name !== 'Little Joker') {
                    // If Big Joker, check if next is Little Joker.
                    isTuolaji = false;
                    break;
                  } else if (sortedSelectedCards[j].name === 'Little Joker' && sortedSelectedCards[j + 2].value !== this.props.gameInfo.trumpNumber && sortedSelectedCards[j + 2].suit !== this.props.gameInfo.trumpSuit) {
                    // If Little Joker, check if next is a trump number and suit
                    isTuolaji = false;
                    break;
                  } else if (sortedSelectedCards[j].value === this.props.gameInfo.trumpNumber && sortedSelectedCards[j].suit === this.props.gameInfo.trumpSuit && sortedSelectedCards[j + 2].value !== this.props.gameInfo.trumpNumber) {
                    // If trump number and suit, check if next is a trump number
                    isTuolaji = false;
                    break;
                  } else if (sortedSelectedCards[j].value === this.props.gameInfo.trumpNumber && sortedSelectedCards[j + 2].value !== this.props.gameInfo.trumpNumber) {
                    // If trump number, check if next is trump number
                    isTuolaji = false;
                    break;
                  } else if (sortedSelectedCards[j].value === this.props.gameInfo.trumpNumber && sortedSelectedCards[j + 2].sortValue !== 47) {
                    // If trump number, check if next is trump Ace
                    isTuolaji = false;
                    break;
                  } else if (sortedSelectedCards[j].sortValue - 1 !== sortedSelectedCards[j + 2]) {
                    // In here means, you are not Big Joker, Little Joker, Trump Number + Suit, or Trump Number.
                    isTuolaji = false;
                    break;
                  }
                }
              }
            }
            if (isTuolaji) {
              isShuai = false;
            } else {
              // it is not a Tuolaji, so check if it is a shuai
              // need to check if it really is a shuai, this one is checking pairs
              for (let k = 0; k < firstPlayed.length - 1; k += 1) {
                if (firstPlayed[k].suit !== firstPlayed[k + 1].suit || (firstPlayed[k].trump && !firstPlayed[k + 1].trump)) {
                  isShuai = false;
                  break;
                }
              }
            }
          } else if (!isTuolaji && isShuai) {
            // It is not a Tuolaji, so it must be shuai.
            // check if it really is a shuai, this one is check non pairs
            for (let l = 0; l < firstPlayed.length - 1; l += 1) {
              if (firstPlayed[l].suit !== firstPlayed[l + 1].suit || (firstPlayed[l].trump && !firstPlayed[l + 1].trump)) {
                isShuai = false;
                break;
              }
            }
          }
          /* Here ends repeated Code */

          // if firstPlayed is a Tuolaji
          if (isTuolaji) {
            // Tuolajis are consecutive pairs, so must include all pairs that are consecutive that are the same suit as firstPlayed
            for (let m = 0; m < currentPlayerHand.length; m += 1) {
              const currentHandCard = currentPlayerHand[m];
              if (currentPlayerHand[m + 1] !== undefined) {
                const nextHandCard = currentPlayerHand[m + 1];
                if ((firstPlayed[0].trump && currentHandCard.trump) || (!firstPlayed[0].trump && !currentHandCard.trump && currentHandCard.suit === firstPlayed[0].suit)) {
                  if (currentHandCard.name === nextHandCard.name && currentHandCard.suit === nextHandCard.suit) {
                    pairPlayable.push(currentHandCard);
                    pairPlayable.push(nextHandCard);
                    m += 1;
                  } else {
                    playable.push(currentHandCard);
                  }
                }
              } else {
                if ((firstPlayed[0].trump && currentHandCard.trump) || (!firstPlayed[0].trump && !currentHandCard.trump && currentHandCard.suit === firstPlayed[0].suit)) {
                  playable.push(currentHandCard);
                }
              }
            }
            for (let n = 0; n < pairPlayable.length - 2; n += 2) {
              // Take a look at the first card in pairPlayable
              const currentCard = pairPlayable[n];
              let currentN = n;
              let consecutive = 1;
              // [ 10s 10s 9s 9s 7s 7s 6s 6s 5s 5s ]
              while (pairPlayable[currentN + 1 + consecutive] !== undefined && this.isConsecutive(currentCard, consecutive, pairPlayable[currentN + 1 + consecutive])) {
                consecutive += 1;
                currentN += 1;
              }

              // Adds all consecutive pairs to mustPlay.
              for (let o = n; o < consecutive * 2; o += 1) {
                mustPlay.push(pairPlayable[o]);
              }

              // Loops over the pairs that were added so we don't look over the same ones again.
              for (let p = 0; p < consecutive; p += 1) {
                n += 1;
              }
            }
            // want to loop through pairPlayable and remove the consecutives.
            for (let x = 0; x < pairPlayable.length; x += 1) {
              for (let y = 0; y < mustPlay.length; y += 1) {
                if (_.isEqual(pairPlayable[x], mustPlay[y])) {
                  const duplicate = pairPlayable.find((card) => {
                    return card.name === mustPlay[y].name && card.suit === mustPlay[y].suit && card.unique === mustPlay[y].unique;
                  });
                  const index = pairPlayable.indexOf(duplicate);
                  pairPlayable.splice(index, 1);
                }
              }
            }
            // now we have mustPlay which are consecutives, pairPlayable which are pairs, and playable which are same suits
            const beforeMustPlay = mustPlay.length;
            const beforePairPlayable = pairPlayable.length;
            const beforePlayable = playable.length;

            if (beforeMustPlay !== 0) {
              // you own consecutive pair, play it
              // but the length is less than firstPlayed, then you play those then play pairs
              if (beforeMustPlay < firstPlayed.length) {
                // Play consecutives then pairs
                for (let a = 0; a < mustPlay.length; a += 1) {
                  for (let b = 0; b < sortedSelectedCards.length; b += 1) {
                    if (_.isEqual(sortedSelectedCards[b], mustPlay[a])) {
                      const playedCard = mustPlay.find((card) => {
                        return card.name === sortedSelectedCards[b].name && card.suit === sortedSelectedCards[b].suit && card.unique === sortedSelectedCards[b].unique;
                      });
                      const index = mustPlay.indexOf(playedCard);
                      mustPlay.splice(index, 1);
                    }
                  }
                }
                if (Math.abs(beforePairPlayable - beforeMustPlay) < firstPlayed.length) {
                  // Look at pairs then look at playable
                  for (let c = 0; c < pairPlayable.length; c += 1) {
                    for (let d = 0; d < sortedSelectedCards.length; d += 1) {
                      if (_.isEqual(sortedSelectedCards[d], pairPlayable[c])) {
                        const playedCard = pairPlayable.find((card) => {
                          return card.name === sortedSelectedCards[d].name && card.suit === sortedSelectedCards[d].suit && card.unique === sortedSelectedCards[d].unique;
                        });
                        const index = pairPlayable.indexOf(playedCard);
                        pairPlayable.splice(index, 1);
                      }
                    }
                  }

                  for (let e = 0; e < playable.length; e += 1) {
                    for (let f = 0; f < sortedSelectedCards.length; f += 1) {
                      if (_.isEqual(sortedSelectedCards[f], playable[e])) {
                        const playedCard = playable.find((card) => {
                          return card.name === sortedSelectedCards[f].name && card.suit === sortedSelectedCards[f].suit && card.unique === sortedSelectedCards[f].unique;
                        });
                        const index = playable.indexOf(playedCard);
                        playable.splice(index, 1);
                      }
                    }
                  }
                } else {
                  // just look at pairs
                  for (let c = 0; c < pairPlayable.length; c += 1) {
                    for (let d = 0; d < sortedSelectedCards.length; d += 1) {
                      if (_.isEqual(sortedSelectedCards[d], pairPlayable[c])) {
                        const playedCard = pairPlayable.find((card) => {
                          return card.name === sortedSelectedCards[d].name && card.suit === sortedSelectedCards[d].suit && card.unique === sortedSelectedCards[d].unique;
                        });
                        const index = pairPlayable.indexOf(playedCard);
                        pairPlayable.splice(index, 1);
                      }
                    }
                  }
                }
              } else {
                // beforeMustPlay is greater than = firstPlayed so you can just play these consecutive pairs.
                for (let a = 0; a < mustPlay.length; a += 1) {
                  for (let b = 0; b < sortedSelectedCards.length; b += 1) {
                    if (_.isEqual(sortedSelectedCards[b], mustPlay[a])) {
                      const playedCard = mustPlay.find((card) => {
                        return card.name === sortedSelectedCards[b].name && card.suit === sortedSelectedCards[b].suit && card.unique === sortedSelectedCards[b].unique;
                      });
                      const index = mustPlay.indexOf(playedCard);
                      mustPlay.splice(index, 1);
                    }
                  }
                }
              }
            } else if (beforePairPlayable !== 0) {
              // you own a pair, play it
              // if you own a pair that is less than the length of firstPlayed, then play those then play playable.
              if (beforePairPlayable < firstPlayed.length) {
                // play from pairPlayable
                for (let a = 0; a < pairPlayable.length; a += 1) {
                  for (let b = 0; b < sortedSelectedCards.length; b += 1) {
                    if (_.isEqual(sortedSelectedCards[b], pairPlayable[a])) {
                      const playedCard = pairPlayable.find((card) => {
                        return card.name === sortedSelectedCards[b].name && card.suit === sortedSelectedCards[b].suit && card.unique === sortedSelectedCards[b].unique;
                      });
                      const index = pairPlayable.indexOf(playedCard);
                      pairPlayable.splice(index, 1);
                    }
                  }
                }
                // play whatever other cards with same suit
                for (let c = 0; c < playable.length; c += 1) {
                  for (let d = 0; d < sortedSelectedCards.length; d += 1) {
                    if (_.isEqual(sortedSelectedCards[d], playable[c])) {
                      const playedCard = playable.find((card) => {
                        return card.name === sortedSelectedCards[d].name && card.suit === sortedSelectedCards[d].suit && card.unique === sortedSelectedCards[d].unique;
                      });
                      const index = playable.indexOf(playedCard);
                      playable.splice(index, 1);
                    }
                  }
                }
              } else {
                // since beforePairPlayable >= firstPlayed.length you can just play all the pairs to satisfy
                for (let a = 0; a < pairPlayable.length; a += 1) {
                  for (let b = 0; b < sortedSelectedCards.length; b += 1) {
                    if (_.isEqual(sortedSelectedCards[b], pairPlayable[a])) {
                      const playedCard = pairPlayable.find((card) => {
                        return card.name === sortedSelectedCards[b].name && card.suit === sortedSelectedCards[b].suit && card.unique === sortedSelectedCards[b].unique;
                      });
                      const index = pairPlayable.indexOf(playedCard);
                      pairPlayable.splice(index, 1);
                    }
                  }
                }
              }
            } else if (beforeMustPlay === 0 && beforePairPlayable === 0) {
              // you don't own a consective pair or a pair, play cards of that suit
              for (let a = 0; a < playable.length; a += 1) {
                for (let b = 0; b < sortedSelectedCards.length; b += 1) {
                  if (_.isEqual(sortedSelectedCards[b], playable[a])) {
                    const playedCard = playable.find((card) => {
                      return card.name === sortedSelectedCards[b].name && card.suit === sortedSelectedCards[b].suit && card.unique === sortedSelectedCards[b].unique;
                    });
                    const index = playable.indexOf(playedCard);
                    playable.splice(index, 1);
                  }
                }
              }
            }
            if (beforeMustPlay !== 0 && (beforeMustPlay - mustPlay.length === firstPlayed.length || pairPlayable.length === 0 || playable.length === 0)) {
              // you had atleast 1 consecutive pair.
              this.props.playCard(gameId, sortedSelectedCards);
            } else if (beforeMustPlay === 0  && beforePairPlayable !== 0 && (beforePairPlayable - pairPlayable.length === firstPlayed.length || playable.length === 0)) {
              // you had no consecutive pairs but cards of that suit, you played pairs of that suit
              this.props.playCard(gameId, sortedSelectedCards);
            } else if (beforeMustPlay === 0 && beforePairPlayable === 0 && beforePlayable !== 0 && (beforePlayable - playable.length === firstPlayed.length || playable.length === 0)) {
              // you had no consecutive pairs or pairs, you played cards of that suit
              this.props.playCard(gameId, sortedSelectedCards);
            } else if (beforeMustPlay === 0 && beforePairPlayable === 0 && beforePlayable === 0) {
              // you had no cards of any that suit
              this.props.playCard(gameId, sortedSelectedCards);
            } else {
              console.log('You must play consecutive pairs if you have, then pairs, then same suit, then whatever you want.');
            }
          } else if (isShuai) {
            // we have a shuai that is either paired or not.
            if (isPair) {
              // if pair, we want to look through hand for pairs
              for (let i = 0; i < currentPlayerHand.length; i += 1) {
                const currentHandCard = currentPlayerHand[i];
                if (currentPlayerHand[i + 1] !== undefined) {
                  const nextHandCard = currentPlayerHand[i + 1];
                  if ((firstPlayed[0].trump && currentHandCard.trump) || (!firstPlayed[0].trump && !currentHandCard.trump && currentHandCard.suit === firstPlayed[0].suit)) {
                    if (currentHandCard.name === nextHandCard.name && currentHandCard.suit === nextHandCard.suit) {
                      mustPlay.push(currentHandCard);
                      mustPlay.push(nextHandCard);
                      i += 1;
                    } else {
                      playable.push(currentHandCard);
                    }
                  }
                } else {
                  if ((firstPlayed[0].trump && currentHandCard.trump) || (!firstPlayed[0].trump && !currentHandCard.trump && currentHandCard.suit === firstPlayed[0].suit)) {
                    playable.push(currentHandCard);
                  }
                }
              }
              const beforeMustPlay = mustPlay.length;
              const beforePlayable = playable.length;
              if (beforeMustPlay !== 0) {
                if (beforeMustPlay < firstPlayed.length) {
                  // look through mustPlay then playable
                  for (let j = 0; j < mustPlay.length; j += 1) {
                    for (let k = 0; k < sortedSelectedCards.length; k += 1) {
                      if (_.isEqual(sortedSelectedCards[k], mustPlay[j])) {
                        const playedCard = mustPlay.find((card) => {
                          return card.name === sortedSelectedCards[k].name && card.suit === sortedSelectedCards[k].suit && card.unique === sortedSelectedCards[k].unique;
                        });
                        const index = mustPlay.indexOf(playedCard);
                        mustPlay.splice(index, 1);
                      }
                    }
                  }

                  for (let l = 0; l < playable.length; l += 1) {
                    for (let m = 0; m < sortedSelectedCards.length; m += 1) {
                      if (_.isEqual(sortedSelectedCards[m], playable[l])) {
                        const playedCard = playable.find((card) => {
                          return card.name === sortedSelectedCards[m].name && card.suit === sortedSelectedCards[m].suit && card.unique === sortedSelectedCards[m].unique;
                        });
                        const index = playable.indexOf(playedCard);
                        playable.splice(index, 1);
                      }
                    }
                  }
                } else {
                  // look through mustPlay
                  for (let j = 0; j < mustPlay.length; j += 1) {
                    for (let k = 0; k < sortedSelectedCards.length; k += 1) {
                      if (_.isEqual(sortedSelectedCards[k], mustPlay[j])) {
                        const playedCard = mustPlay.find((card) => {
                          return card.name === sortedSelectedCards[k].name && card.suit === sortedSelectedCards[k].suit && card.unique === sortedSelectedCards[k].unique;
                        });
                        const index = mustPlay.indexOf(playedCard);
                        mustPlay.splice(index, 1);
                      }
                    }
                  }
                }
              } else if (beforePlayable !== 0) {
                for (let j = 0; j < playable.length; j += 1) {
                  for (let k = 0; k < sortedSelectedCards.length; k += 1) {
                    if (_.isEqual(sortedSelectedCards[k], playable[j])) {
                      const playedCard = playable.find((card) => {
                        return card.name === sortedSelectedCards[k].name && card.suit === sortedSelectedCards[k].suit && card.unique === sortedSelectedCards[k].unique;
                      });
                      const index = playable.indexOf(playedCard);
                      playable.splice(index, 1);
                    }
                  }
                }
              }
              if (beforeMustPlay !== 0
                && (beforeMustPlay - mustPlay.length === firstPlayed.length
                  || playable.length === 0)) {
                // you played pairs when you had some and other playables
                this.props.playCard(gameId, sortedSelectedCards);
              } else if (beforePlayable !== 0
                && (beforePlayable - playable.length === firstPlayed.length
                  || playable.length === 0)) {
                // you have no pairs but have cards of same suit
                this.props.playCard(gameId, sortedSelectedCards);
              } else if (beforeMustPlay === 0 && beforePlayable === 0) {
                // no pairs or cards of suit play whatever
                this.props.playCard(gameId, sortedSelectedCards);
              } else {
                console.log('You must play pairs if you have them, then suits, then whatever');
              }
            } else {
              // if not pair we want to look through hand for same suits.
              for (let i = 0; i < currentPlayerHand.length; i += 1) {
                if (currentPlayerHand[i].trump || (!currentPlayerHand[i].trump && currentPlayerHand[i].suit === firstPlayed[0].suit)) {
                  playable.push(currentPlayerHand[i]);
                }
              }

              const beforeLength = playable.length;
              for (let j = 0; j < playable.length; j += 1) {
                for (let k = 0; k < sortedSelectedCards.length; k += 1) {
                  if (_.isEqual(sortedSelectedCards[k], playable[j])) {
                    const playedCard = playable.find(card =>
                      card.name === sortedSelectedCards[k].name
                      && card.suit === sortedSelectedCards[k].suit
                      && card.unique === sortedSelectedCards[k].unique,
                    );
                    const index = playable.indexOf(playedCard);
                    playable.splice(index, 1);
                  }
                }
              }

              if (beforeLength - playable.length === firstPlayed.length || playable.length === 0) {
                this.props.playCard(gameId, sortedSelectedCards);
              } else if (beforeLength - playable.length < firstPlayed.length) {
                console.log('You played less than the amount required');
              } else {
                console.log('You played cards that are not the same suit as the first played.');
              }
            }
          } else {
            console.log('Not Tuolaji or Shuai');
          }
        }
      } else {
        // lengths are not the same
        console.log('Must play the same amount of cards.');
      }
    }
    // are there problems? write them down here
    // problem three
    // [ 3h, 3h ] was the hand played and hearts is not trump.
    // player_2 tries to play [ 4d, 4h ] but in his hand he has [ 4h, 4h ].
    // so he should not be able to play [ 4d, 4h ].
    // this problem is not solved and should be solved tomorrow

    // problem four (for reference)
    // player_1 plays [ 4h, 4h, 4c, 4c ]
    // player_3 has [ 3s, B, 2h, 3c, 3h ], does he have to play both 3c and 3h?
    // right now he does. i assume he has to play both.

    // problem five
    // if player_1 plays a Tuolaji make sure the other
    // players must play cards of that suit if they have it.
    this.props.emptySelectedCard();
  }

  // helper methods
  getCurrentUser() {
    if (this.props.gameInfo.player_1
      || this.props.gameInfo.player_2
      || this.props.gameInfo.player_3
      || this.props.gameInfo.player_4) {
      if (this.props.gameInfo.player_1.playerName === sessionStorage.currentUser) {
        return this.props.gameInfo.player_1.player;
      } else if (this.props.gameInfo.player_2.playerName === sessionStorage.currentUser) {
        return this.props.gameInfo.player_2.player;
      } else if (this.props.gameInfo.player_3.playerName === sessionStorage.currentUser) {
        return this.props.gameInfo.player_3.player;
      } else if (this.props.gameInfo.player_4.playerName === sessionStorage.currentUser) {
        return this.props.gameInfo.player_4.player;
      }
    }
    return null;
  }

  drawToSwapPhase() {
    // set a timeout for 30 seconds for players to decide if they want to reveal masters
    // otherwise it randomizes masters
    let phaseTimer = setInterval(this.setCountdown, 1000);
    this.setState({ phaseTimer });
  }

  setCountdown() {
    if (this.props.phase !== 'drawPhase') {
      clearInterval(this.state.phaseTimer);
      this.setState({ counter: 6, phaseTimer: null });
    }
    this.setState({ counter: this.state.counter - 1 });
    if (this.state.counter === 0) {
      clearInterval(this.state.phaseTimer);
      if (this.props.gameInfo.currentMaster === '') {
        // no one chose to be master so randomizes
        const players = this.props.gameInfo.users;
        const randomPlayer = Math.floor(Math.random() * 4);

        const presetCard = {
          name: 'Big Joker',
          suit: 'Wild',
          value: 2,
          playedBy: '',
          unique: 0,
          trump: true,
        };

        if (this.props.gameInfo[this.props.gameInfo.turn].playerName === sessionStorage.currentUser) {
          this.props.setNewMaster(
            this.props.gameInfo.gameId,
            players[randomPlayer],
            [presetCard],
            false,
          );
          this.props.changePhase(this.props.gameInfo.gameId, 'swapPhase');
        }
      } else {
        if (this.props.gameInfo[this.props.gameInfo.turn].playerName === sessionStorage.currentUser) {
          this.props.changePhase(this.props.gameInfo.gameId, 'swapPhase');
        }
      }
      this.setState({ counter: 5, phaseTimer: null });
    }
  }

  isConsecutive(currentCard, consecutive, nextCard) {
    // Given the currentCard, consecutive, and nextCard return if the cards are consecutive.
    // currentCard.sortValue - consecutive === pairPlayable[currentN + 1 + consecutive].sortValue
    let result = false;
    if (!currentCard.trump) {
      if (currentCard.sortValue - consecutive === nextCard.sortValue) {
        result = true;
      }
    } else {
      if (this.props.gameInfo.trumpSuit !== ''
        || this.props.gameInfo.trumpSuit !== 'Wild') {
        if (currentCard.name === 'Big Joker'
          && consecutive === 1
          && nextCard.name === 'Little Joker') {
          result = true;
        } else if (currentCard.name === 'Big Joker'
          && consecutive > 1
          && nextCard.value === this.props.gameInfo.trumpNumber) {
          result = true;
        } else if (currentCard.name === 'Little Joker'
          && nextCard.value === this.props.gameInfo.trumpNumber) {
          result = true;
        } else if (currentCard.value === this.props.gameInfo.trumpNumber
          && nextCard.value === this.props.gameInfo.trumpNumber) {
          result = true;
        }
      } else {
        if (currentCard.name === 'Big Joker'
          && consecutive === 1
          && nextCard.name === 'Little Joker') {
          result = true;
        } else if (currentCard.name === 'Big Joker' && consecutive === 2 && nextCard.value === this.props.gameInfo.trumpNumber && nextCard.suit === this.props.gameInfo.trumpSuit) {
          result = true;
        } else if (currentCard.name === 'Big Joker' && consecutive > 2 && consecutive < 6 && nextCard.value === this.props.gameInfo.trumpNumber) {
          result = true;
        } else if (currentCard.name === 'Big Joker' && consecutive > 5 && currentCard.sortValue - consecutive === nextCard.sortValue) {
          result = true;
        } else if (currentCard.name === 'Little Joker' && consecutive === 1 && nextCard.value === this.props.gameInfo.trumpNumber && nextCard.suit === this.props.gameInfo.trumpSuit) {
          result = true;
        } else if (currentCard.name === 'Little Joker' && consecutive > 1 && consecutive < 5 && nextCard.value === this.props.gameInfo.trumpNumber) {
          result = true;
        } else if (currentCard.name === 'Little Joker' && consecutive > 4 && currentCard.sortValue - consecutive === nextCard.sortValue) {
          result = true;
        } else if (currentCard.value === this.props.gameInfo.trumpNumber
          && currentCard.suit === this.props.gameInfo.trumpSuit
          && consecutive < 4
          && nextCard.value === this.props.gameInfo.trumpNumber) {
          result = true;
        } else if (currentCard.value === this.props.gameInfo.trumpNumber
          && currentCard.suit === this.props.gameInfo.trumpSuit
          && consecutive > 3
          && currentCard.sortValue - consecutive === nextCard.sortValue) {
          result = true;
        } else if (currentCard.value === this.props.gameInfo.trumpNumber
          && nextCard.value === this.props.gameInfo.trumpNumber) {
          result = true;
        } else if (currentCard.value === this.props.gameInfo.trumpNumber
          && currentCard.sortValue - consecutive === nextCard.sortValue) {
          result = true;
        } else if (currentCard.sortValue - consecutive === nextCard.sortValue) {
          result = true;
        }
      }
    }
    return result;
  }

  // render methods
  getUser(int) {
    if (this.props.gameInfo.player_1
      && this.props.gameInfo.player_2
      && this.props.gameInfo.player_3
      && this.props.gameInfo.player_4) {
      const currentUser = this.getCurrentUser(); // returns player_1, player_2, player_3, player_4
      const split = currentUser.split('_');
      const player = split[0];
      let number = parseInt(split[1], 10);
      number = (number + int) % 4;
      if (number === 0) {
        number = 4;
      }
      return this.props.gameInfo[`${player}_${number}`];
    }
    return null;
  }

  renderRevealedCards() {
    const cardList = [];
    this.props.gameInfo.revealedTrump.map((card) => {
      cardList.push(
        <Card
          playable={false}
          hand={false}
          name={card.name}
          suit={card.suit}
          value={card.value}
          playedBy={card.playedBy}
          unique={card.unique}
          sortValue={card.sortValue}
          trump={card.trump}
          _id={card._id}
        />,
      );
      return null;
    });
    return cardList;
  }

  renderMiddleCards() {
    // for when phase goes to swapPhase, renders the cards in the middle for the master.
    if (this.props.gameInfo.currentMaster !== '') {
      if (this.props.gameInfo[this.props.gameInfo.currentMaster].playerName === sessionStorage.currentUser && this.props.phase === 'swapPhase') {
        const deckList = [];
        this.props.gameInfo.deck.map((card) => {
          deckList.push(
            <Card
              playable
              hand={false}
              name={card.name}
              suit={card.suit}
              value={card.value}
              playedBy={card.playedBy}
              unique={card.unique}
              sortValue={card.sortValue}
              trump={card.trump}
              _id={card._id}
            />,
          );
          return null;
        });
        // loop through the deck and return the list
        return deckList;
      }
    }
    return null;
  }

  renderCenterCards() {
    const centerList = [];
    this.props.gameInfo.center.map((card) => {
      centerList.push(
        <Card
          playable={false}
          hand={false}
          name={card.name}
          suit={card.suit}
          value={card.value}
          playedBy={card.playedBy}
          unique={card.unique}
          sortValue={card.sortValue}
          trump={card.trump}
          _id={card._id}
        />,
      );
      return null;
    });

    return centerList;
  }

  renderTrumpSuit() {
    const suit = this.props.gameInfo.trumpSuit;
    const heart = '\u2665';
    const diamond = '\u2666';
    const club = '\u2663';
    const spade = '\u2660';
    let renderSuit = '';
    if (suit === 'Heart') {
      renderSuit = heart;
    } else if (suit === 'Diamond') {
      renderSuit = diamond;
    } else if (suit === 'Club') {
      renderSuit = club;
    } else if (suit === 'Spade') {
      renderSuit = spade;
    }
    return (
      <div>
        {renderSuit}
      </div>
    );
  }

  render() {
    if (this.props.gameInfo === undefined) {
      return (
        <Redirect to="/" />
      );
    } else if (this.props.gameInfo.player_1 && this.props.gameInfo.player_2 && this.props.gameInfo.player_3 && this.props.gameInfo.player_4) {
      return (
        <div className="game-page">
          <div className="flex-top">
            <CardHolder position="top" user={this.getUser(2)} />
            <div className={`${this.props.phase !== 'swapPhase' && this.props.gameInfo.turn === this.getUser(2).player}-2`}>
              {this.getUser(2).playerName}
            </div>
          </div>
          <div className="flex-middle">
            <CardHolder position="left" user={this.getUser(1)} />
            <div className={`left ${this.props.phase !== 'swapPhase' && this.props.gameInfo.turn === this.getUser(1).player}-1`}>
              {this.getUser(1).playerName}
            </div>
            <div className="game-info">
              {this.props.gameInfo.trumpSuit !== '' ? <div className="trump-suit">{this.renderTrumpSuit()}</div> : null}
              <div
                className="deck"
                role="presentation"
                onClick={() => this.drawCard()}
              >
                {this.props.gameInfo.deck.length}
              </div>
              {this.props.phase === 'drawPhase' ? <button className="reveal-trump-button" onClick={() => this.onRevealTrumpClick()}>Reveal Trump</button> : null}
              {this.props.phase === 'swapPhase' && this.props.gameInfo.currentMaster !== '' && this.props.gameInfo[this.props.gameInfo.currentMaster].playerName === sessionStorage.currentUser ? <button className="swap-button" onClick={() => this.swapCardsClick()}>Swap Cards</button> : null}
              {this.props.phase === 'playPhase' && this.props.gameInfo[this.props.gameInfo.turn].playerName === sessionStorage.currentUser ? <button className="play-button" onClick={() => this.playCardsClick()}>Play Cards</button> : null}
              {this.props.gameInfo.deck.length === 8 && this.props.phase === 'drawPhase' ? <div ref='timer'>{this.state.counter}</div> : null}
              {this.props.phase === 'swapPhase' && this.props.gameInfo.currentMaster !== '' && this.props.gameInfo[this.props.gameInfo.currentMaster].playerName === sessionStorage.currentUser ? <div className="swapable-cards">{this.renderMiddleCards()}</div> : null}
              {this.props.gameInfo.revealedTrump.length !== 0
                && this.props.phase === 'drawPhase'
                ? <div ref='revealedCards' className="revealed-cards">
                  {this.renderRevealedCards()}
                </div>
                : null}
              {this.props.gameInfo.center.length !== 0
                ? <div className="center-cards">
                  {this.renderCenterCards()}
                </div>
                : null}
            </div>
            <div className={`right ${this.props.phase !== 'swapPhase' && this.props.gameInfo.turn === this.getUser(3).player}-3`}>
              {this.getUser(3).playerName}
            </div>
            <CardHolder position="right" user={this.getUser(3)} />
          </div>
          <div className="flex-bottom">
            <div className={`bottom ${this.props.phase !== 'swapPhase' && this.props.gameInfo.turn === this.getUser(0).player}-0`}>
              {this.getUser(0).playerName}
            </div>
            <CardHolder position="bottom" user={this.getUser(0)} />
          </div>
        </div>
      );
    } else {
      return (
        <div className="loading">Loading...</div>
      );
    }
  }
}

Game.contextTypes = {
  router: PropTypes.object,
};

Game.propTypes = {
  gameInfo: PropTypes.object,
  selectedCards: PropTypes.array,
  swapCards: PropTypes.array,
  phase: PropTypes.string,
  playCard: PropTypes.func,
  getGame: PropTypes.func,
  deleteGame: PropTypes.func,
  addCardToHand: PropTypes.func,
  phaseEnd: PropTypes.func,
  restartRound: PropTypes.func,
  setNewMaster: PropTypes.func,
  swapCard: PropTypes.func,
  changePhase: PropTypes.func,
  emptySwapCard: PropTypes.func,
  emptySelectedCard: PropTypes.func,
};

function mapStateToProps(state) {
  return {
    gameInfo: state.gameInfo.data,
    selectedCards: state.selectedCards,
    swapCards: state.swapCards,
    phase: state.phase };
}

export default connect(mapStateToProps, actions)(Game);
