const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcrypt');

const handleLogin = async(req,res)=>{
    const {username,password} = req.body;
    if(!username || !password) return res.status(400).json({'message':'Username and Password are required.'});

    const foundUser = await User.findOne({username}).exec();
    if(!foundUser) return res.sendStatus(401);

    const match = await bcrypt.compare(password,foundUser.password);
    if(match){
        try{
            const accessToken = jwt.sign(
                {
                    "username":foundUser.username,
                    "email":foundUser.email,
                    "id":foundUser._id
                },
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn:'2m'}
            );
            const refreshToken = jwt.sign(
                {"username":foundUser.username,"email":foundUser.email,"id":foundUser._id},
                process.env.REFRESH_TOKEN_SECRET,
                {expiresIn:'1d'}
            );

            foundUser.refreshToken=refreshToken;
            const result = await foundUser.save();

            res.cookie('jwt',refreshToken,{httpOnly:true,sameSite:'None'}).json(result);
        }catch(err){
            res.status(500).json({'message':err.message});
        }
    }else{
        res.sendStatus(401);
    }
}

module.exports = {handleLogin};