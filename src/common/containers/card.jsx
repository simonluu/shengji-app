import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

import * as actions from '../actions';

class Card extends Component {
  constructor(props) {
    super(props);

    this.updateSelectedCards = this.updateSelectedCards.bind(this);
    this.updateHand = this.updateHand.bind(this);
  }

  // life cycle functions
  componentDidUpdate() {
    if (this.props.selectedCards.length === 0 && this.props.swapCards.length === 0) {
      this.refs[`${this.props.suit}_${this.props.name}`].className = 'playing-card';
    }
  }

  // on click functions
  updateSelectedCards() {
    const selectedCard = {
      name: this.props.name,
      suit: this.props.suit,
      value: this.props.value,
      playedBy: this.props.playedBy,
      unique: this.props.unique,
      sortValue: this.props.sortValue,
      trump: this.props.trump,
      _id: this.props._id,
    };
    const card = this.refs[`${this.props.suit}_${this.props.name}`];
    const filteredCard = this.props.selectedCards.filter(temp => _.isEqual(temp, selectedCard));

    if (this.props.playable && (this.props.phase === 'drawPhase' || (this.props.gameInfo[this.props.gameInfo.turn].playerName === sessionStorage.currentUser && this.props.phase === 'playPhase'))) {
      this.updateHand(card, filteredCard);
    } else if (this.props.playable && this.props.gameInfo[this.props.gameInfo.currentMaster].playerName === sessionStorage.currentUser && this.props.phase === 'swapPhase') {
      if (this.props.hand) {
        this.updateHand(card, filteredCard);
      } else {
        // deck card
        const filteredSwapCard = this.props.swapCards.filter(temp => _.isEqual(temp, selectedCard));
        if (!filteredSwapCard.length > 0) {
          card.className = 'playing-card selected';
          this.props.addSwapCard(
            this.props.name,
            this.props.suit,
            this.props.value,
            this.props.playedBy,
            this.props.unique,
            this.props.sortValue,
            this.props.trump,
            this.props._id);
        } else {
          card.className = 'playing-card';
          this.props.removeSwapCard(
            this.props.name,
            this.props.suit,
            this.props.value,
            this.props.playedBy,
            this.props.unique,
            this.props.sortValue,
            this.props.trump,
            this.props._id);
        }
      }
    }
  }

  // helper methods
  updateHand(card, filteredCard) {
    const tempCard = card;
    if (!filteredCard.length > 0) {
      tempCard.className = 'playing-card selected';
      this.props.addSelectedCard(
        this.props.name,
        this.props.suit,
        this.props.value,
        this.props.playedBy,
        this.props.unique,
        this.props.sortValue,
        this.props.trump,
        this.props._id);
    } else {
      tempCard.className = 'playing-card';
      this.props.removeSelectedCard(
        this.props.name,
        this.props.suit,
        this.props.value,
        this.props.playedBy,
        this.props.unique,
        this.props.sortValue,
        this.props.trump,
        this.props._id);
    }
  }

  render() {
    const heart = '\u2665';
    const diamond = '\u2666';
    const club = '\u2663';
    const spade = '\u2660';
    const bigJoker = 'B';
    const littleJoker = 'L';

    let renderName = '';
    let renderSuit = '';

    if (this.props.name === 'Big Joker') {
      renderName = bigJoker;
    } else if (this.props.name === 'Little Joker') {
      renderName = littleJoker;
    } else {
      renderName = this.props.name;
    }

    if (this.props.suit === 'Heart') {
      renderSuit = heart;
    } else if (this.props.suit === 'Diamond') {
      renderSuit = diamond;
    } else if (this.props.suit === 'Club') {
      renderSuit = club;
    } else if (this.props.suit === 'Spade') {
      renderSuit = spade;
    }

    return (
      <span ref={`${this.props.suit}_${this.props.name}`} role="presentation" className="playing-card" onClick={() => this.updateSelectedCards()}>
        {renderName}
        {renderSuit}
      </span>
    );
  }
}

Card.propTypes = {
  gameInfo: PropTypes.object,
  name: PropTypes.string,
  suit: PropTypes.string,
  value: PropTypes.number,
  playedBy: PropTypes.string,
  unique: PropTypes.number,
  sortValue: PropTypes.number,
  trump: PropTypes.bool,
  _id: PropTypes.number,
  playable: PropTypes.bool,
  hand: PropTypes.bool,
  phase: PropTypes.string,
  addSelectedCard: PropTypes.func,
  addSwapCard: PropTypes.func,
  removeSelectedCard: PropTypes.func,
  removeSwapCard: PropTypes.func,
  swapCards: PropTypes.func,
  selectedCards: PropTypes.func,
};

function mapStateToProps(state) {
  return {
    gameInfo: state.gameInfo.data,
    selectedCards: state.selectedCards,
    swapCards: state.swapCards,
    phase: state.phase,
  };
}

export default connect(mapStateToProps, actions)(Card);