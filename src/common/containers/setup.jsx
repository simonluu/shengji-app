import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Everytime route goes to /, it should reset redux state to {}
class Setup extends Component {
  render() {
    return (
      <main className="setup">
        {this.props.children}
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

