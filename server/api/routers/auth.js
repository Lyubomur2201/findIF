const express = require('express');
const authControler = require('../controlers/authControler');
const validator = require('../helpers/validators');
const passport = require('passport');
const router = express.Router();
const passportConf = require('../../passport');

router.post('/registration', 
    validator.validate(validator.userSchema), 
    authControler.registration
);

router.post('/login',
    passport.authenticate('local', { session: false }),
    authControler.login);

router.get('/google', passport.authenticate('google', { session: false, scope: ['profile', 'email'] }));

router.get('/google/redirect', 
    passport.authenticate('google', { session: false }), authControler.googleOauth);

router.get('/facebook', passport.authenticate('facebook', { session: false, scope: ['email'] }))

router.get('/facebook/redirect',
    passport.authenticate('facebook', { session: false }), authControler.facebookOauth)

module.exports = router;

 