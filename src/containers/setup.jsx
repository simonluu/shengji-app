import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import Index from '../components/index-page';
import HowToPlay from '../components/how-to-play';
import NewGame from './new-game';
import JoinGame from './join-game';
import Lobby from './lobby';
import GameOver from './game-over';

// Everytime route goes to /, it should reset redux state to {}
class Setup extends Component {
  render() {
    return (
      <main className="setup">
        <Switch>
          <Route exact path="/" component={Index} />
          <Route exact path="/new-game" component={NewGame} />
          <Route exact path="/join-game" component={JoinGame} />
          <Route exact path="/how-to-play" component={HowToPlay} />
          <Route exact path="/lobby" render={(props) => (
            <Lobby {...props} socket={this.props.socket} />
          )} />
          <Route exact path="/game-over" component={GameOver} />
        </Switch>
        <hr />
        <footer>
          <div>
            <a target="_blank" rel="noopener noreferrer" href="https://en.wikipedia.org/wiki/Sheng_ji">How to Play</a>
          </div>
          <div>
            <a target="_blank" rel="noopener noreferrer" href="https://github.com/simonluu/shengji-app">https://github.com/simonluu/shengji-app</a>
          </div>
        </footer>
      </main>
    );
  }
}

Setup.propTypes = {
  gameInfo: PropTypes.object,
};

function mapStateToProps(state) {
  return { gameInfo: state.gameInfo.data };
}

export default connect(mapStateToProps)(Setup);

