const passport = require('passport');
const JWTStategy = require('passport-jwt').Strategy;
const GoogleStrategy = require('passport-google-oauth20');
const FacebookStrategy = require('passport-facebook').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const { ExtractJwt } = require('passport-jwt');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const fbgraph = require('fbgraph');

const User = require('./api/models/user');

passport.use(new JWTStategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET
    }, async (payload, done) => {
        try{
            const user = await User.findById(payload.id);

            if(!user) {
                return done(null, false)
            }
            done(null, user)
        } catch(err) {
            done(err, false)
        };
    }));

passport.use('google', new GoogleStrategy({
    clientID: process.env.GOOGLE_OAUTH_ID,
    clientSecret: process.env.GOOGLE_OAUTH_SECRET,
    callbackURL: "http://localhost:3030/auth/google/redirect",
}, async (accessToken, refreshToken, profile, done) => {
    console.log(profile);
    
    try {        
        const match = await User.findOne({ 'google.id': profile.id });
        if(match) {
            return done(null, match)
        } else {
            const user = await User({
                _id: new mongoose.Types.ObjectId(),
                username: profile.displayName,
                name: profile.name.givenName,
                surname: profile.name.familyName,
                google: {
                    id: profile.id,
                    email: profile.emails[0].value
                },
                created: new Date()
            })
            user.strategy = 'google';
            await user.save();
            done(null, user)
        }
    } catch(err) {
        done(err, false);
    };
}));

passport.use('facebook', new FacebookStrategy({
    clientID: process.env.FACEBOOK_OAUTH_ID,
    clientSecret: process.env.FACEBOOK_OAUTH_SECRET,
    callbackURL: "http://localhost:3030/auth/facebook/redirect",
    profileFields: ['id', 'name', 'displayName', 'emails']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const match = await User.findOne({ 'facebook.id': profile.id });
        if(match) {
            return done(null, match)
        } else {
            const data = await fbgraph.get(`${profile.id}?fields=id,name,link,photos&access_token=${accessToken}`,
            async (err,res) => {
                try {
                    const user = await User({
                        _id: new mongoose.Types.ObjectId(),
                        username: profile.displayName,
                        name: profile.name.givenName,
                        surname: profile.name.familyName,
                        facebook: {
                            id: profile.id,
                            link: res.link,
                            email: profile.emails[0].value
                        },
                        created: new Date()
                    })
                    user.strategy = 'facebook';
                    await user.save();
                    return done(null, user)
                } catch(err) {
                    done(err, false);
                    
                }
            });
        }
    } catch(err) {
        done(err, false);
    };
}));

passport.use(new LocalStrategy({
    usernameField: 'username'
}, async (username, password, done) => {
    try {
        
        const user = await User.findOne({username: username});

        if(!user) {
            return done(null, false);
        };
        
        const isEqual = await bcrypt.compare(password, user.local.password)
        
        if(!isEqual){
            return done(null, false);
        }

        done(null, user);
    } catch(err) {
        done(err, false);
    }
}));
