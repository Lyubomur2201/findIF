const User = require('../models/user');
const Post = require('../models/post');

module.exports.getAllUsers = async (req, res, next) => {
    const users = await User.find();      
    return res.status(200).json({
        count: users.length,
        users: users.map(user => {
            return {
                id: user.id,
                username: user.username,
                name: user.name,
                surname: user.surname,
                email: user.local.email || user.google.email || user.facebook.email,
                phone: user.phone,
                facebook: user.facebook.link,
                instagram: user.instagram, 
                url: 'http://127.0.0.1:3030/user/' + user.id,
            };
        })
    });
};

module.exports.getMyUser = async (req, res, next) => {

    const user = await {
        id: req.user.id,
        username: req.user.username,
        name: req.user.name,
        surname: req.user.surname,
        email: req.user.local.email,
        phone: req.user.phone,
        facebook: req.user.facebook.link,
        instagram: req.user.instagram, 
    };

    if(req.query.posts === 'true'){
        let posts = await Post.find({user: req.user.id})
        return res.status(200).json({
            user: user,
            posts: posts.map(post => {
                return {
                    id: post.id,
                    title: post.title,
                    content: post.content,
                    files: [post.files.map(file => {
                        return {
                            filename: file,
                            url: 'http://127.0.0.1:3030/static/media/images/post/' + file
                        }
                    })],
                    date: post.date,
                    url: 'http://127.0.0.1:3030/post/' + post.id,
                }
            })
        });
    } else {
        res.status(200).json({ user: user });
    };
};

module.exports.updateMyUser = async (req, res, next) => {

    await User.findByIdAndUpdate(req.user.id, { $set: req.body })
    return res.status(200).json({
        message: 'User updated',
    });

};

module.exports.deleteMyUser = async (req, res ,next) => {

    await User.findByIdAndDelete(req.user.id)
    return res.status(200).json({
        message: 'User was delited'
    });

};

module.exports.getUserById = async (req, res, next) => {

    const user = await User.findById(req.params.id).exec()
    .then(user => { 
        return {
            id: user.id,
            username: user.username,
            name: user.name,
            surname: user.surname,
            email: user.local.email,
            phone: user.phone,
            facebook: user.facebook.link,
            instagram: user.instagram, 
        };
    });
    if(req.query.posts === 'true'){
        const posts = await Post.find({user: user.id})
        return res.status(200).json({
            user: user,
            posts: posts.map(post => {
                return {
                    id: post.id,
                    title: post.title,
                    content: post.content,
                    files: [post.files.map(file => {
                        return {
                            filename: file,
                            url: 'http://127.0.0.1:3030/static/media/images/post/' + file
                        }
                    })],
                    date: post.date,
                    url: 'http://127.0.0.1:3030/post/' + post.id,
                }
            }),
        });

    } else {
        res.status(200).json({
            user: user
            });
    }
};