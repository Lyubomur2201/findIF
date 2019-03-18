const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = async (req, res, next) => {
    if(!(req.headers.authorization === undefined)){
        try{
            const token = req.headers.authorization.split(' ')[1];     
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            await User.findById(decoded.id)
            .exec()
            .then(user => {
                if(user){
                    req.user = user;
                    next();
                } else {
                    return res.status(404).json({
                        message: 'Invalid Token'
                    })
                }
            })
            .catch(err => {
                return res.status(500).json({
                    error: err
                });
            });
                            
        } catch(err) {
            return res.status(500).json({
                error: err
            });
            
        };
    } else {
        req.user = "Anonimous";
        next();
    };
};