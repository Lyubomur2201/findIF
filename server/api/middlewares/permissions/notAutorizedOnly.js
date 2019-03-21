module.exports = (req, res, next) => {
    if(!req.user){
        next();
    } else{
        return res.status(400).json({
            message: 'Not authorized only'
        });
}};