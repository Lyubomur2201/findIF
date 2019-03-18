const express = require('express');
const authControler = require('../controlers/authControler');
const notAuthorizedOnly = require('../middlewares/permissions/notAutorizedOnly')
const validator = require('../helpers/validators');

const router = express.Router();

router.post('/registration', 
    notAuthorizedOnly,
    validator.validate(validator.userSchema), 
    authControler.registration
);

router.post('/login', notAuthorizedOnly, authControler.login);

module.exports = router;
