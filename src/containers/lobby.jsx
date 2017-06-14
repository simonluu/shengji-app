import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import _ from 'lodash';

import * as actions from '../actions';

class Lobby extends Component {
  constructor(props) {
    super(props);

    this.changeTeams = this.changeTeams.bind(this);
    this.helperLeaveGame = this.helperLeaveGame.bind(this);
    this.routeHome = this.routeHome.bind(this);
  }

  // life cycle methods
  componentDidUpdate() {
    if (this.props.gameInfo.gameStart) {
      this.props.history.push(`/game/${this.props.gameInfo.gameId}`);
    }
  }

  componentWillUnmount() {
    // this.helperLeaveGame();
  }

  // on click methods
  onClickLeaveGame() {
    this.helperLeaveGame();
  }

  onClickStartGame() {
    const gameId = this.props.gameInfo.gameId;
    this.props.startGame(gameId);
  }

  changeTeams(e, index) {
    this.props.changeTeam(this.props.gameInfo.gameId, index, e.target.value);
  }

  // helper methods
  helperLeaveGame() {
    const gameId = this.props.gameInfo.gameId;
    const index = _.findIndex(this.props.gameInfo.users, (user) => { return user === sessionStorage.getItem('currentUser') });
    if (this.props.gameInfo.users.length === 1) {
      this.props.deleteGame(gameId, this.routeHome);
    } else {
      this.props.leaveGame(gameId, this.props.currentUser, index, this.routeHome);
    }
  }

  validTeams() {
    let oneCount = 0;
    let twoCount = 0;
    this.props.gameInfo.teams.map((team) => {
      if (team === 1) {
        return oneCount += 1;
      } else {
        return twoCount += 1;
      }
    });
    if (oneCount === 2 && twoCount === 2) {
      return true;
    }
    return false;
  }

  routeHome() {
    this.props.history.push('/');
  }

  // render methods
  renderUserList() {
    if (this.props.gameInfo.users !== undefined) {
      const userArray = [];
      this.props.gameInfo.users.map((user, index) => {
        if (user === sessionStorage.getItem('currentUser')) {
          userArray.push(
            <li key={`${user}`} className="user-element">
              {user}
              <select id="team" name="team" defaultValue={0} onChange={(e) => {this.changeTeams(e, index)}}>
                <option value={0} disabled></option>
                <option value={1}>Team 1</option>
                <option value={2}>Team 2</option>
              </select>
            </li>,
          );
        } else {
          userArray.push(
            <li key={`${user}`} className="user-element">
              {user}
              <div id="team" className="disabled">
                {this.props.gameInfo.teams[index] === 0 ? '' : `Team ${this.props.gameInfo.teams[index]}`}
              </div>
            </li>,
          );
        }

        return null;
      });
      return userArray;
    }
    return null;
  }

  render() {
    if (!_.isEmpty(this.props.gameInfo)) {
      if (this.props.gameInfo.error) {
        return (
          <div className="lobby-page">
            <h1>{this.props.gameInfo.error}</h1>
            <hr />
            <Link className="main-button" to="/">Home</Link>
          </div>
        );
      } else {
        return (
          <div className="lobby-page">
            {this.props.gameInfo.users.length !== 4 ? <h1>{`Waiting for ${4 - this.props.gameInfo.users.length} more players...`}</h1> : <h1>Game is ready to start</h1>}
            <h5>Game ID: <span>{this.props.gameInfo.gameId}</span></h5>
            <hr />
            <ul ref="users" className="user-list">{this.renderUserList()}</ul>
            <div
              className={`main-button players-${this.props.gameInfo.users.length === 4 && this.validTeams()}`}
              onClick={() => this.onClickStartGame()}
            >
              Start Game
            </div>
            <div
              className="main-button"
              onClick={() => this.onClickLeaveGame()}
            >
              Leave Game
            </div>
          </div>
        );
      }
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

Lobby.propTypes = {
  gameInfo: PropTypes.object,
  currentUser: PropTypes.string,
  getGame: PropTypes.func,
  startGame: PropTypes.func,
  leaveGame: PropTypes.func,
  deleteGame: PropTypes.func,
};

function mapStateToProps(state) {
  const name = sessionStorage.currentUser || state.currentUser;
  return { gameInfo: state.gameInfo.data, currentUser: name };
}

export default withRouter(connect(mapStateToProps, actions)(Lobby));
