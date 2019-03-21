const express = require('express');
const passport = require('passport');
const router = express.Router();
const userControler = require('../controlers/userControler');
const authorizedOnly = require('../middlewares/permissions/authorizedOnly')
const passportConf = require('../../passport');

router.get('/', userControler.getAllUsers);

router.get('/my-account', 
    passport.authenticate('jwt', { session: false }),
    userControler.getMyUser);

router.patch('/my-account', 
    passport.authenticate('jwt', { session: false }),
    userControler.updateMyUser);

router.delete('/my-account',
    passport.authenticate('jwt', { session: false }),
    userControler.deleteMyUser);

router.get('/:id', userControler.getUserById);

module.exports = router;