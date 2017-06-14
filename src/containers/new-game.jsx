import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

import * as actions from '../actions';

class NewGame extends Component {
  constructor(props) {
    super(props);

    this.routeLobby = this.routeLobby.bind(this);
  }

  createClick() {
    const name = this.refs.name;
    this.props.recentUser(name.value);
    this.props.createGame(name.value, this.routeLobby);
  }

  routeLobby() {
    this.props.history.push('/lobby');
  }

  render() {
    return (
      <div className="new-game-page">
        <h1>Create a New Game</h1>
        <hr />
        <input ref="name" type="text" placeholder="Enter your name" />
        <div className="secondary-button" onClick={() => this.createClick()}>Create</div>
        <Link className="secondary-button" to="/">Back</Link>
      </div>
    );
  }
}

NewGame.propTypes = {
  history: PropTypes.object,
  recentUser: PropTypes.func,
  createGame: PropTypes.func,
};

export default withRouter(connect(null, actions)(NewGame));