const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: { type: String, required: true },
    name: { type: String },
    surname: { type: String },
    local: {
        email: { 
            type: String,
        },
        password: { type: String },
    },
    created: { type: Date, default: new Date() },
    google: {
        id: { type: String },
        email: { 
            type: String,
        },
    },
    phone: { type: String },
    facebook: { 
        id: { type: String },
        email: { 
            type: String,
        },
     },
    instagram: { type: String },
    isAdmin: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
});

UserSchema.pre('save', function(next) {
    try {
        if(this.strategy === 'local'){
            bcrypt.hash(this.local.password, 10, (err, hash) => {
                if(err){                
                    return next(err);
                };
                this.local.password = hash;
                next();
            });
        }
        if(this.strategy === 'google') {
            next();
        }
        if(this.strategy === 'facebook') {
            next();
        }
    } catch (err) {
        next(err)
    };
});
module.exports = mongoose.model('User', UserSchema);


