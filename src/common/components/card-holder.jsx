import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Card from '../containers/card';

class CardHolder extends Component {
  renderCards() {
    if (this.props.user.hand !== undefined) {
      const cards = [];

      this.props.user.hand.map((card) => {
        if (this.props.position === 'bottom') {
          cards.push(
            <Card
              playable
              hand
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
        } else {
          cards.push(
            <span className={`${this.props.position} card-back`} />,
          );
        }

        return null;
      });

      return cards;
    }
    return null;
  }

  render() {
    return (
      <div className={`card-holder-${this.props.position} ${this.props.user.master}`}>
        {this.renderCards()}
      </div>
    );
  }
}

CardHolder.propTypes = {
  position: PropTypes.string,
  user: PropTypes.object,
};

export default CardHolder;
