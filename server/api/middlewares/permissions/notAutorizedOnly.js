module.exports = (req, res, next) => {
    if(req.user === 'Anonimous'){
        next();
    } else{
        return res.status(400).json({
            message: 'Not authorized only'
        });
}};