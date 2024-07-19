const mongoose = require('mongoose');

const moveSchema = new mongoose.Schema({
  start: {
    cell: { type: String },
    cellIndex: { type: Number },
    rowIndex: { type: Number },
  },
  end: {
    cell: { type: String },
    cellIndex: { type: Number },
    rowIndex: { type: Number },
  }
}, { _id: false });

const GameSchema = new mongoose.Schema({
  players: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      username: { type: String, required: true }
    }
  ],
  gameState: { type: String },
  moves: [moveSchema],
  result: { type: String }, 
  chat: [{
    sender: { type: String },
    message: { type: String },
    timestamp: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Game', GameSchema);
