const express = require('express');
const passport = require('passport');
const postControler = require('../controlers/postControler');
const isOwnerOrAdmin = require('../middlewares/permissions/isOwnerOrAdmin');
const validator = require('../helpers/validators');
const passportConf = require('../../passport');

const router = express.Router();

router.get('/', postControler.getPosts);
router.post('/',
    passport.authenticate('jwt', { session: false }),
    validator.validate(validator.postSchema), 
    postControler.makePost
);

router.get('/:id', postControler.getPostById);
router.patch('/:id',
    passport.authenticate('jwt', { session: false }),
    isOwnerOrAdmin,
    validator.validate(validator.postUpdateSchema), 
    postControler.updatePost
);
router.delete('/:id',
    passport.authenticate('jwt', { session: false }),
    isOwnerOrAdmin,
    postControler.deletePosts
);

module.exports = router;
