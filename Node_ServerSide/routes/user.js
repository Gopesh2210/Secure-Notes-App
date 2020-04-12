const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const router  = express.Router();

router.post('/signup',(req,res,next)=>{
    // encypting the passwword using bcrypt package
    bcrypt.hash(req.body.password,10)
    .then(hash =>{
        const user = new User({
            name : req.body.name,
            email : req.body.email,
            password : hash
        });

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
});

router.post('/login',(req,res,next)=>{

    let fetchedUser;
    User.findOne({ email : req.body.email})
    .then(user => {
        // checking if user exists
        if(!user){
            return res.status(401).json({   message: 'Auth Failed!, incorrect email'   });
        }
        // setting user to acces in other then block
        fetchedUser = user;
        // checking user password
        return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {

        if(!result){
            return res.status(401).json({   message: 'Auth Failed!, incorrect password'   });
        }

        // creating the jwt token for auth
        const token = jwt.sign(
                {email : fetchedUser.email, name: fetchedUser.name, userId: fetchedUser._id},
                'this_is_the_secret_line_used_to_generate_the_token',
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
});

module.exports = router;
