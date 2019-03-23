const express = require('express');
const passport = require('passport');
const multer = require('multer');

const authControler = require('../controlers/authControler');
const validator = require('../helpers/validators');
const passportConf = require('../../passport');

const router = express.Router();

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        
        var err = new Error('Unsupported media type');
        err.status = 415;
        cb(err, false);
    }

}

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, process.env.STATIC_PATH + 'media/images/user')
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + '___' + file.originalname)
    }
});
const upload =  multer({storage: storage, fileFilter: fileFilter})


router.post('/registration',
    upload.single('avatar'),
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

 