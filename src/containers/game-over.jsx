import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import * as actions from '../actions';

const GameOver = () =>
  (
    <div className="game-over-page">
      <h1>Game Over</h1>
      <hr />
      <Link className="secondary-button" to="/">Main Page</Link>
    </div>
  );

GameOver.propTypes = {
  gameInfo: PropTypes.object,
}

function mapStateToProps(state) {
  return { gameInfo: state.gameInfo.data };
}

export default connect(mapStateToProps, actions)(GameOver);