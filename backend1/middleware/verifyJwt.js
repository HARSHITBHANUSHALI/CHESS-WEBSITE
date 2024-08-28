const jwt = require('jsonwebtoken')

const verifyJwt = (req,res,next)=>{
    let token;
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    } 
    // If not found, check for the token in the cookie header
    else if (req.cookies?.jwt) {
        token = req.cookies.jwt;
    }

    // If no token is found in either header, return unauthorized status
    if (!token) return res.sendStatus(401); // Unauthorized
    
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err,decoded)=>{
            if(err) return res.sendStatus(403);//invalid token
            req.user = decoded.UserInfo.username;
            req.roles = decoded.UserInfo.roles;
            next();
        }
    );
}

module.exports = verifyJwt;