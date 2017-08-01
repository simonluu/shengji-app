const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Card = require('./card-model');

const playerSchema = new Schema({
  playerName: { type: String, lowercase: true },
  player: String,
  team: String,
  master: Boolean,
  trumpNumber: Number,
  score: Number,
  hand: [Card.schema],
});

const Player = mongoose.model('Player', playerSchema);

module.exports = {
  model: Player,
  schema: playerSchema,
};
