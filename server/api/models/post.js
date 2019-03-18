const mongoose = require('mongoose');

const PostSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    title: String,
    content: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: new Date()
    }
});

module.exports = mongoose.model('Post', PostSchema);
