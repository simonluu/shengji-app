import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import { history } from './store/configureStore';

// imports main application
import App from './components/app';
import Setup from './containers/setup';
import Game from './containers/game';
import Index from './components/index-page';
import HowToPlay from './components/how-to-play';
import NewGame from './containers/new-game';
import JoinGame from './containers/join-game';
import Lobby from './containers/lobby';
import GameOver from './containers/game-over';

export const Routes = () => {
  return (
    <ConnectedRouter history={history}>
      <div>
        <App>
          <Switch>
            <Route exact path="/game/:gameID" component={Game} />
            <Setup>
              <Switch>
                <Route exact path="/" component={Index} />
                <Route exact path="/new-game" component={NewGame} />
                <Route exact path="/join-game" component={JoinGame} />
                <Route exact path="/how-to-play" component={HowToPlay} />
                <Route exact path="/lobby" component={Lobby} />
                <Route exact path="/game-over" component={GameOver} />
              </Switch>
            </Setup>
          </Switch>
        </App>
      </div>
    </ConnectedRouter>
  );
};

export default Routes;