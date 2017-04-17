var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var PropertiesReader = require('properties-reader');

//required routes
var index = require('./routes/index');
var home = require('./routes/home');
var profiles = require('./routes/profiles');

var app = express();

// properties file
var properties = PropertiesReader('properties.ini');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// session setup
app.use(session({
    secret: properties.get('app.session.secret'),
    resave: false,
    saveUninitialized: false
}));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Check authentication user
app.all('*', checkAuth);

// Route system
app.use('/', index);
app.use('/home', home);
app.use('/me', profiles);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    console.log('ERROR: Page not found, code 404');
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

// Function verify if user is authenticated with account spotify
function checkAuth(req, res, next) {
    if (req.path === '/' || req.path === '/login' || req.path === '/callback/') {
        if (req.session.spotify) {
            res.redirect('/home');
        } else
            next();
    } else {
        if (!req.session.spotify) {
            console.log(`User is not authenticated!. Redirect to path "/".`);
            req.session.destroy();
            res.redirect('/');
        } else {
            next();
        }
    }
}

module.exports = app;
