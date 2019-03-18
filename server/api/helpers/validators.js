const Joi = require('joi');

module.exports.userSchema = Joi.object().keys({

    email: Joi.string().email().required(),
    username: Joi.string().required(),
    password: Joi.string().required(),
    name: Joi.string(),
    surname: Joi.string(),
    phone: Joi.string(),
    fb: Joi.string(),
    instagram: Joi.string(),

});

module.exports.userUpdateSchema = Joi.object().keys({

    email: Joi.string().email(),
    username: Joi.string(),
    name: Joi.string(),
    surname: Joi.string(),
    phone: Joi.string(),
    fb: Joi.string(),
    instagram: Joi.string(),

});

module.exports.postSchema = Joi.object().keys({

    title: Joi.string(),
    content: Joi.string().required(),

});

module.exports.postUpdateSchema = Joi.object().keys({

    title: Joi.string(),
    content: Joi.string(),

});

module.exports.validate = (schema) => {

    return (req, res, next) => {
        const result = Joi.validate(req.body, schema);
        if(result.error){
            return res.status(400).json(result.error)
        };
            req.body = result.value;
            next();
    };
};