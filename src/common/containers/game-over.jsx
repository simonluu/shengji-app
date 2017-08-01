import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Cookies from 'universal-cookie';
import _ from 'lodash';

import * as actions from '../actions';

const cookies = new Cookies();

class GameOver extends Component {
  render() {
    if (!_.isEmpty(this.props.gameInfo)) {
      cookies.remove('uniqueGameId', `${this.props.gameInfo.gameId}`, { path: '/' });
      return (
        <div className="game-over-page">
          <h1>Game Over</h1>
          <hr />
          <Link className="secondary-button" to="/">Main Page</Link>
        </div>
      );
    } else {
      return (
        <div className="lobby-page">
          <h1>Loading...</h1>
          <hr />
          <Link className="main-button" to="/">Home</Link>
        </div>
      );
    }
  }
}

GameOver.propTypes = {
  gameInfo: PropTypes.object,
}

function mapStateToProps(state) {
  return { gameInfo: state.gameInfo.data };
}

export default connect(mapStateToProps, actions)(GameOver);