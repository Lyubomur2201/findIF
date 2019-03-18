const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken')
module.exports.login = (req, res, next) => {

    User.findOne({ username: req.body.username })
    .exec()
    .then(user => {
        if(!user){            
            return res.status(401).json({
                message: 'Auth failed'
            });
        };

        bcrypt.compare(req.body.password, user.password)
        .then(result => {
            if(result){
                const token = jwt.sign(
                    {
                    email: user.email,
                    id: user._id,
                    },
                    process.env.JWT_SECRET,
                    {
                        expiresIn: '24h',
                    }
                );
                return res.status(200).json({
                    message: 'Successfully authorized',
                    token: token
                })
            };
            return res.status(401).json({
                message: 'Auth failed'
            })
        })
        .catch(err => {            
            return res.status(401).json({
                message: 'Auth failed'
            });
        });
    })
    .catch(err => {
        
        return res.status(500).json({
            error: err
        });
    });
};

module.exports.registration = (req, res, next) => {
    
    User.find({email: req.body.email})
    .exec()
    .then(user => {
        if(user.length >= 1){
            return res.status(409).json({
                message: "Mail exists"
            });
        }

        bcrypt.hash(req.body.password, 10, (err, hash) => {
            if(err){
                return res.status(500).json({
                    error: error
                });
            };
            const user = new User({
                _id: new mongoose.Types.ObjectId(),
                username: req.body.username,
                name: req.body.name,
                surname: req.body.surname,
                email: req.body.email,
                password: hash,
                phone: req.body.phone,
                fb: req.body.fb,
                instagram: req.body.instagram,
            });
            user.save()
            .then(result => {
                return res.status(201).json({
                    message: 'Regitred user',
                    user: {
                            id: user.id,
                            username: req.body.username,
                            name: req.body.name,
                            surname: req.body.surname,
                            email: req.body.email,
                            phone: req.body.phone,
                            fb: req.body.fb,
                            instagram: req.body.instagram,
                            url: 'http://127.0.0.1:3030/user/' + user.id,
                        }
                    })   
                })
            .catch(err => {            
                res.status(500).json({
                    error: err
                });
            });
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });

};