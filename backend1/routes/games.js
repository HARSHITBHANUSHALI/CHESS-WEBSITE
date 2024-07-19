// routes/games.js
const express = require('express');
const router = express.Router();
const Game = require('../models/Game');
const mongoose = require('mongoose');

// GET /api/users/:userId/games - Get all games for a user
router.get('/users/:userId/games', async (req, res) => {
    try {
        const { userId } = req.params;
        console.log('Fetching games for user ID:', userId); // Add logging

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID format' });
        }

        const games = await Game.find({ 'players.userId': new mongoose.Types.ObjectId(userId) }).populate('players.userId', 'username');
        res.json(games);
    } catch (error) {
        console.error('Error fetching user games:', error); // Enhanced error logging
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

module.exports = router;
