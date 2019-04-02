const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');

const authRouts = require('./api/router/auth');
const userRouts = require('./api/router/user');
const postRouts = require('./api/router/post')

const homeRouts = require('./views/routes/home');
const adminRouts = require('./views/routes/admin');

const app = express();

mongoose.connect('mongodb+srv://Admin:' + process.env.MONGODB_ATLAS_PSW + '@findif-szu6p.gcp.mongodb.net/test?retryWrites=true', { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(passport.initialize())

app.use((req, res, next) => {
    res.header('Acess-Control-Allow-Origin', '*');
    res.header('Acess-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    
    if (req.method == 'OPTIONS'){
        res.header('Acess-Control-Allow-Headers', 'GET, PATCH, POST, DELETE');
        return res.status(200).json({});
    }
    next();
});
app.use('/static', express.static(process.env.STATIC_PATH))
app.use((req, res, next) => {
    try {
        next();
    } catch(err) {
        res.status(500).json({
            error: err
        });
    }
});
app.use('/', homeRouts);
app.use('/home', homeRouts);
app.use('/auth', authRouts);
app.use('/api/user', userRouts);
app.use('/api//post', postRouts);

app.use('/admin', adminRouts);
app.use((req, res, next) => {
    const error = new Error('Page not found');
    error.status = 404;
    next(error);
});
app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;