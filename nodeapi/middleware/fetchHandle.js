const { verify } = require("jsonwebtoken");

const JwtSecret = "myKey";

const fetchUser = (req,res,next)=>{
    // this is the name of header which contain JWT token used in thundercloud 
    // from here token is fetched
    const token = req.header('auth-token');

    // if token is not provided
    if(!token){
        res.status(401).send("please send token to validate");
    }

    // if token is recived
    try {
        // if token is not verified so it sent to catch error
        const data = verify(token,JwtSecret);
        // if token is verified
        // reqest data is modified to decoded data 
        req.user = data.user;
        // next is used to continue out of middleware
        // if next is not used so code will be stuck at middleware
        next();        

    } catch (error) {
        // if token does not match 
        res.status(401).send(`token auth failed with error \n ${error}`);
    }
}


module.exports = fetchUser;

