const express = require('express');
const router = express.Router();
const userControler = require('../controlers/userControler');
const authorizedOnly = require('../middlewares/permissions/authorizedOnly')

router.get('/', userControler.getAllUsers);

router.get('/my-account', authorizedOnly, userControler.getMyUser);
router.patch('/my-account', authorizedOnly, userControler.updateMyUser);
router.delete('/my-account', authorizedOnly, userControler.deleteMyUser);

router.get('/:id', userControler.getUserById);

module.exports = router;