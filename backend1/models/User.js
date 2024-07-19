const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    photos: { type: [String], default: [] }, // Array of strings for photos
    stats: {
        gamesPlayed: { type: Number, default: 0 },
        gamesWon: { type: Number, default: 0 },
        gamesLost: { type: Number, default: 0 },
        gamesDrawn: { type: Number, default: 0 }
    },
    games: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Game' }],
    socketId: { type: String },
    room: { type: String, default: 'default-room' } // Default room value
});

module.exports = mongoose.model('User', UserSchema);
