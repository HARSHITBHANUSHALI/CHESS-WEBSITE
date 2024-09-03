const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.get('/', async (req, res) => {
    const token = req.cookies.jwt; 
    if (token) {
        jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err, userData) => {
            if (err) return res.status(403).json({ message: 'Invalid token' });

            try {
                const user = await User.findOne({ username: userData.username });
                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }
                
                const { password,...userInfo } = user;
                const {_doc} = userInfo;
                console.log(_doc);
                res.json(_doc);
            } catch (err) {
                res.status(500).json({ message: err.message });
            }
        });
    } else {
        res.json(null);
    }
});

module.exports = router;
