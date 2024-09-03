const jwt = require('jsonwebtoken')

const verifyJwt = (req,res,next)=>{
    let token;

    if (req.cookies?.jwt) {
        token = req.cookies.jwt;
    }
    // If no token is found in either header, return unauthorized status
    if (!token) return res.sendStatus(401); // Unauthorized

    jwt.verify(
        token,
        process.env.REFRESH_TOKEN_SECRET,
        (err,decoded)=>{
            if(err) return res.sendStatus(403);//invalid token
            next();
        }
    );
}

module.exports = verifyJwt;