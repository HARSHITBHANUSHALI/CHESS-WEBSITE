const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
    roomId: { type: String, required: true, unique: true },
    players: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
            socketId: { type: String },
            username: { type: String, required: true }
        }
    ],
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'Game' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Room', RoomSchema);