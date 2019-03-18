module.exports = (req, res, next) => {
    if(req.user === 'Anonimous'){
        return res.status(401).json({
            message: 'Authorized only'
        })
    } else{
        next();
    }
};