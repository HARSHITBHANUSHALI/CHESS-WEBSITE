const express = require('express');
const router = express.Router();
const User = require('../models/User');
const mongoose = require('mongoose');

router.get('/:userId', async (req, res) => {
    try {
        const {userId} = req.params;
        const {stats} = await User.findOne({_id:userId}).exec();
        res.json(stats);
    } catch (error) {
        console.error('Error fetching user stats:', error); // Enhanced error logging
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

module.exports = router;
