import React from 'react';
import { Link } from 'react-router-dom';

const Index = () =>
  (
    <div className="index-page">
      <h1>Sheng ji Online</h1>
      <hr />
      <Link className="main-button" to="/new-game" style={{ marginRight: '5px' }}>New Game</Link>
      <Link className="main-button" to="/join-game">Join Game</Link>
    </div>
  );

export default Index;
