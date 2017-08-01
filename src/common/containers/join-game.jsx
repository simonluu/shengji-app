import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

import * as actions from '../actions';

class JoinGame extends Component {
  constructor(props) {
    super(props);

    this.routeLobby = this.routeLobby.bind(this);
  }

  joinGame() {
    const gameId = this.refs.gameId;
    const name = this.refs.name;
    this.props.recentUser(name.value);
    this.props.joinGame(gameId.value, name.value, this.routeLobby);
  }

  routeLobby() {
    this.props.history.push('/lobby');
  }

  render() {
    return (
      <div className="join-game-page">
        <h1>Join a Game</h1>
        <hr />
        <input ref='gameId' type="text" placeholder="Game ID" />
        <input ref='name' type="text" placeholder="Name" />
        <div className="secondary-button" onClick={() => this.joinGame()}>Join</div>
        <Link className="secondary-button" to="/">Back</Link>
      </div>
    );
  }
}

JoinGame.propTypes = {
  recentUser: PropTypes.func,
  joinGame: PropTypes.func,
};

export default withRouter(connect(null, actions)(JoinGame));