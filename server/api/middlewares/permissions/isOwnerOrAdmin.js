const Post = require('../../models/post');

module.exports = async (req, res, next) => {
    if(!req.user){
        return res.status(405).json({
            message: 'Access denied'
        })
    } else{
        if(req.user.isAdmin){
            await Post.findById(req.params.id)
            .exec()
            .then(post => {
                if(post){
                    req.post = post;
                    next();

                } else {
                    return res.status(404).json({
                        message: 'Post not found'
                    });
                }
            })
            .catch(err => {
                return res.status(500).json({
                    error: err
                });
            });
        } else {
            await Post.findById(req.params.id)
            .exec()
            .then(post => {
                if(post){
                    if(post.user == req.user.id){
                        req.post = post;
                        next();
                    } else {
                        return res.status(405).json({
                            message: 'Access denied'
                        });
                    };

                };
            })
            .catch(err => {
                return res.status(500).json({
                    error: err
                });
            });
        };
    };
};