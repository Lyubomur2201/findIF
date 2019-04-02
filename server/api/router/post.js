const express = require('express');
const passport = require('passport');
const multer = require('multer');

const postControler = require('../controlers/postControler');
const isOwnerOrAdmin = require('../middlewares/permissions/isOwnerOrAdmin');
const validator = require('../helpers/validators');
const passportConf = require('../../passport');

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
        cb(null, process.env.STATIC_PATH + 'media/images/post')
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + '___' + file.originalname)
    }
});
const upload =  multer({storage: storage, fileFilter: fileFilter})
const router = express.Router();

router.get('/', postControler.getPosts);
router.post('/',
    passport.authenticate('jwt', { session: false }),
    upload.array('postImages', 10),
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
