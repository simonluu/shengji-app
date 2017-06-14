import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import Setup from '../containers/setup';
import Game from '../containers/game';

export default class App extends Component {
  render() {
    return (
      <div className="app">
        <Switch>
          <Route path="/game/:gameID" component={Game} />
          <Route path="/" component={Setup} />
        </Switch>
      </div>
    );
  }
}