const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
var CryptoJS = require("crypto-js");

const User = require('../models/user');

function decryptPassword(encryptedPassword){
    // Decrypt the password using crypto-js
    var bytes  = CryptoJS.AES.decrypt(encryptedPassword, 'mysecretkey');
    var originalPassword = bytes.toString(CryptoJS.enc.Utf8);  
    // console.log("PASSWORD originally : ",originalPassword);

    return originalPassword;
}

exports.createUser = (req,res,next)=>{

    // console.log("On SIGN UP : ",req.body.password);
    const originalPassword = decryptPassword(req.body.password);

    // hashing the passwword using bcryptjs package
    bcryptjs.hash(originalPassword,10)
    .then(hash =>{
        const user = new User({
            name : req.body.name,
            email : req.body.email,
            password : hash
        })

    // saving the user in the database
        user.save()
        .then(result => {
            res.status(201).json({
                message: "User created",
                result: result
            });
        })
        .catch(err => {
            res.status(500).json({
                message: "Email ID already registered!"
            });
        });
    });
};

exports.userLogin = (req,res,next)=>{

    let fetchedUser;
    User.findOne({ email : req.body.email})
    .then(user => {
        // checking if user exists
        if(!user){
            return res.status(401).json({   message: 'Auth Failed!, incorrect email'   });
        }
        // setting user to acces in other then block
        fetchedUser = user;
        // console.log("On LOGIN  : ",req.body.password)
        const decryptedPassword = decryptPassword(req.body.password);
        // checking user password
        return bcryptjs.compare(decryptedPassword, fetchedUser.password);
    })
    .then(result => {

        if(!result){
            return res.status(401).json({   message: 'Auth Failed!, incorrect password'   });
        }

        // creating the jwt token for auth
        const token = jwt.sign(
                {email : fetchedUser.email, name: fetchedUser.name, userId: fetchedUser._id},
                process.env.JWT_KEY,
                { expiresIn: '1h' }
            );
        
        // return the token
        return res.status(200).json({
            token: token,
            userName : fetchedUser.name,
            expiresIn : 3600,
            userId : fetchedUser._id
        });

    })
    .catch(err =>{
            return res.status(401).json({   message: 'Invalid Authentication Credentials!'   });
    });
};