const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const User = require('../models/user');

signToken = async user => {
    const token = await jwt.sign(
        {
        username: user.username,
        id: user._id,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '24h',
        }
    );
    return token;
};

module.exports.login = async (req, res, next) => {
    const token = await signToken(req.user);
    return res.status(200).json({
        token: token
    });

};

module.exports.registration = async (req, res, next) => {

    const exist = await User.find({'local.email': req.body.email });

    if(exist.length >= 1){
        fs.unlinkSync(process.env.STATIC_PATH + 'media/images/user/' + req.file.filename)
        return res.status(409).json({
            message: "Mail exists"
        });
    }

    const user = await  new User({
        _id: new mongoose.Types.ObjectId(),
        username: req.body.username,
        name: req.body.name,
        surname: req.body.surname,
        avatar: req.file.filename,
        local: {
            email: req.body.email,
            password: req.body.password,
        },
        phone: req.body.phone,
        instagram: req.body.instagram,
        created: new Date()
    });
    user.strategy = 'local';
    await user.save()

    const token = await signToken(user);

    return res.status(200).json({
        message: 'Regitred user',
        user: {
                id: user.id,
                username: user.username,
                name: user.name,
                surname: user.surname,
                email: user.local.email,
                avatar: 'http://localhost:3030/static/media/images/user/' + user.avatar,
                phone: user.phone,
                instagram: user.instagram,
                url: 'http://localhost:3030/user/' + user.id,
            },
        token: token
    });
};

module.exports.googleOauth = async (req, res, next) => {    
    const token = await signToken(req.user);
    return res.status(200).json({
        token: token
    });
};

module.exports.facebookOauth = async (req, res, next) => {
    const token = await signToken(req.user);
    return res.status(200).json({
        token: token
    });
};