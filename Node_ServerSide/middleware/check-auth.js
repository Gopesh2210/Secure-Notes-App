const jwt = require('jsonwebtoken');


// this middleware is responsible for ensuring the authentication of certain apis like post notes, edit notes, delete notes

module.exports = (req,res,next) => {
    try{
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token,'this_is_the_secret_line_used_to_generate_the_token');
        req.userData = { email: decodedToken.email, userId: decodedToken.userId };
        next();

    }catch(error){
        res.status(401).json({
            message: 'You are not authenticated!'
        });
    }
};