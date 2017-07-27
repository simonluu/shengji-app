const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Player = require('./player-model');
const Card = require('./card-model');

const gameSchema = new Schema({
  gameId: { type: String, unique: true },
  users: [String],
  teams: [Number],
  gameStart: Boolean,
  round: Number,
  pair: Boolean,
  brokenTrump: Boolean,
  trumpSuit: String,
  trumpNumber: Number,
  turn: String,
  turnNumber: Number,
  firstPlayed: [Card.schema],
  currentMaster: String,
  deck: [Card.schema],
  revealedTrump: [Card.schema],
  center: [Card.schema],
  player_1: Player.schema,
  player_2: Player.schema,
  player_3: Player.schema,
  player_4: Player.schema,
  createdAt: { type: Date, expires: 28800, default: Date.now }
});

const Game = mongoose.model('Game', gameSchema);

module.exports = {
  model: Game,
  schema: gameSchema,
};
