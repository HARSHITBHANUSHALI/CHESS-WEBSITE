const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcrypt');

const handleSignUp = async(req,res)=>{
    const {username,email,password} = req.body;
    if(!username || !email || !password) return res.status(400).json({'message':'Username, Email and Password, all are required'});

    const duplicate = await User.findOne({username}).exec();
    if(duplicate) return res.sendStatus(409);

    try{
        const hashedPassword = await bcrypt.hash(password,10);
        const result = await User.create({
            username,email,password:hashedPassword
        });

        const userResponse = {
            _id: result._id,
            username: result.username,
            email: result.email
        };
        res.status(200).json(userResponse);
    }catch(err){
        res.status(500).json({'message':err.message});
    }
};

module.exports = {handleSignUp};