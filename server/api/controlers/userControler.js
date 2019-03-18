const User = require('../models/user');
const Post = require('../models/post');

module.exports.getAllUsers = (req, res, next) => {
    User.find()
    .exec()
    .then(users => {        
        return res.status(200).json({
            count: users.length,
            users: users.map(user => {
                return {
                    id: user.id,
                    username: user.username,
                    name: user.name,
                    surname: user.surname,
                    email: user.email,
                    phone: user.phone,
                    fb: user.fb,
                    instagram: user.instagram, 
                    url: 'http://127.0.0.1:3030/user/' + user.id,
                };
            })
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
};

module.exports.getMyUser = (req, res, next) => {
    if(req.query.posts === 'true'){
        Post.find({user: req.user.id})
        .exec()    
        .then(posts => {
            return res.status(200).json({
                user: {
                    _id: req.user.id,
                    username: req.user.username,
                    name: req.user.name,
                    surname: req.user.surname,
                    email: req.user.email,
                    phone: req.user.phone,
                    fb: req.user.fb,
                    instagram: req.user.instagram,
                },
                posts: posts.map(post => {
                    return {
                        id: post.id,
                        title: post.title,
                        date: post.date,
                        content: post.content,
                        url: 'http://127.0.0.1:3030/post/' + post.id,
                    }
                }),
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
    } else {
        res.status(200).json({
            user:  {
                id: req.user.id,
                username: req.user.username,
                name: req.user.name,
                surname: req.user.surname,
                email: req.user.email,
                phone: req.user.phone,
                fb: req.user.fb,
                instagram: req.user.instagram,
            }
        });
    }
}

module.exports.updateMyUser = (req, res, next) => {
    User.findByIdAndUpdate(req.user.id, { $set: req.body })
    .exec()
    .then(result => {        
        return res.status(200).json({
            message: 'User updated',
            user: {
                id: result.id,
                username: result.username,
                name: result.name,
                surname: result.surname,
                email: result.email,
                phone: result.phone,
                fb: result.fb,
                instagram: result.instagram,
            },   
        });
    })
    .catch(err => {        
        res.status(500).json({
            error: err
        });
    });
};

module.exports.deleteMyUser = (req, res ,next) => {
    User.findByIdAndDelete(req.user.id)
    .exec()
    .then(result => {
        return res.status(200).json({
            message: 'User was delited'
        });
    })
    .catch(err => {
        res.status(500).json(err);
    });
};

module.exports.getUserById = async (req, res, next) => {
    const user = await User.findById(req.params.id)
    .exec()
    .then(user => {
        return {
            id: user.id,
            username: user.username,
            name: user.name,
            surname: user.surname,
            email: user.email,
            phone: user.phone,
            fb: user.fb,
            instagram: user.instagram,
        };
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });

    if(req.query.posts === 'true'){
        Post.find({user: user.id})
        .exec()    
        .then(posts => {            
            return res.status(200).json({
                user: user,
                posts: posts.map(post => {
                    return {
                        id: post.id,
                        title: post.title,
                        content: post.content,
                        date: post.date,
                        url: 'http://127.0.0.1:3030/post/' + post.id,
                    }
                }),
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
    } else {
        res.status(200).json({
            user: user
            });
    }
};