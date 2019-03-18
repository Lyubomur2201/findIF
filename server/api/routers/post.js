const express = require('express');

const postControler = require('../controlers/postControler');
const authorizedOnly = require('../middlewares/permissions/authorizedOnly');
const isOwnerOrAdmin = require('../middlewares/permissions/isOwnerOrAdmin');
const validator = require('../helpers/validators');

const router = express.Router();

router.get('/', postControler.getPosts);
router.post('/',
    authorizedOnly, 
    validator.validate(validator.postSchema), 
    postControler.makePost
);

router.get('/:id', postControler.getPostById);
router.patch('/:id', 
    isOwnerOrAdmin,
    validator.validate(validator.postUpdateSchema), 
    postControler.updatePost
);
router.delete('/:id',
    isOwnerOrAdmin,
    postControler.deletePosts
);

module.exports = router;
