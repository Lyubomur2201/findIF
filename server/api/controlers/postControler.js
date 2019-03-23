const mongoose = require('mongoose');
const fs = require('fs')
const Post = require('../models/post');

module.exports.getPosts = async (req, res, next) => {
    const posts = await  Post.find();

    return res.status(200).json({
        count: posts.length,
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
                user: {
                    id: post.user,
                    url: 'http://127.0.0.1:3030/user/' + post.user,
                },
                url: 'http://127.0.0.1:3030/post/' + post.id,
            };
        })
    });
};

module.exports.getPostById = async (req, res, next) => {
    const post = await Post.findById(req.params.id);

    if(post){
        res.status(200).json({
            post: {
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
};

module.exports.makePost = async (req, res, next) => {
    
    const post = await Post({
        _id: new mongoose.Types.ObjectId(),
        user: req.user.id,
        title: req.body.title,
        content: req.body.content,
        files: req.files.map(file => {
            return file.filename
        }),
        date: new Date()
    });
    await post.save();
    return res.status(201).json({
        message: 'Post maded',
        post: {
            id: post.id,
            title: post.title,
            content: post.content,
            date: post.date,
            files: post.files.map(file => {
                return {
                    filemanne: file,
                    url: 'http://127.0.0.1:3030/static/media/images/post/' + file
                }
            }),
            user: {
                id: post.user,
                url: 'http://127.0.0.1:3030/user/' + post.user,
            },
            url: 'http://127.0.0.1:3030/post/' + post.id
        },   
    });
};

module.exports.updatePost = async (req, res, next) => {

    await Post.findByIdAndUpdate(req.params.id, { $set: req.body })
    return res.status(200).json({
        message: 'Post updated',
    });
};

module.exports.deletePosts = async (req, res, next) => {
    const post = await Post.findByIdAndDelete(req.params.id);
    post.files.map(file => {
        fs.unlinkSync(process.env.STATIC_PATH + 'media/images/post/' + file)
    })
    return res.status(200).json({
        message: 'Post was delited'
    });
};