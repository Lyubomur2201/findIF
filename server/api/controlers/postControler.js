const mongoose = require('mongoose');
const Post = require('../models/post');

module.exports.getPosts = (req, res, next) => {
    Post.find()
    .exec()
    .then(posts => {           
        res.status(200).json({
            count: posts.length,
            posts: posts.map(post => {
                return {
                    id: post.id,
                    title: post.title,
                    content: post.content,
                    date: post.date,
                    user: {
                        id: post.user,
                        url: 'http://127.0.0.1:3030/user/' + post.user,
                    },
                    url: 'http://127.0.0.1:3030/post/' + post.id,
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

module.exports.getPostById = (req, res, next) => {
    const post = Post.findById(req.params.id)
    .exec()
    .then(post => {
        if(post){
            res.status(200).json({
                post: {
                    id: post.id,
                    title: post.title,
                    content: post.content,
                    date: post.date,
                    user: {
                        id: post.user,
                        url: 'http://127.0.0.1:3030/user/' + post.user,
                    },
                }
            });
        } else {
            return res.status(404).json({
                message: 'Post not found'
            });
        }
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
};

module.exports.makePost = (req, res, next) => {
    const post = Post({
        _id: new mongoose.Types.ObjectId(),
        user: req.user.id,
        title: req.body.title,
        content: req.body.content,
        date: new Date()
    });
    post.save()
    .then(post => {
        return res.status(201).json({
            message: 'Post maded',
            post: {
                _id: post._id,
                title: post.title,
                content: post.content,
                date: post.date,
                user: {
                    id: post.user,
                    url: 'http://127.0.0.1:3030/user/' + post.user,
                },
            },   
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
};

module.exports.updatePost = (req, res, next) => {

    Post.findByIdAndUpdate(req.params.id, { $set: req.body })
    .exec()
    .then(result => {        
        return res.status(200).json({
            message: 'Post updated',
            post: {
                id: result.id,
                title: result.title,
                content: result.content,
                date: result.date,
                user: {
                    id: result.user,
                    url: 'http://127.0.0.1:3030/user/' + result.user,
                },
            },   
        });
    })
    .catch(err => {
        res.status(500).json(err);
    });
};

module.exports.deletePosts = (req, res, next) => {
    Post.findByIdAndDelete(req.params.id)
    .exec()
    .then(result => {
        return res.status(200).json({
            message: 'Post was delited'
        });
    })
    .catch(err => {
        res.status(500).json(err);
    });
};