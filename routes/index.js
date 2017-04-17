var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var rp = require('request-promise');
var qs = require('querystring');
var PropertiesReader = require('properties-reader');

var router = express.Router();
var properties = PropertiesReader('properties.ini');

const client_id = properties.get('spotify.client.id');
const secret_id = properties.get('spotify.secret.id');
const endpoint_authorize = properties.get('spotify.endpoint.authorize');
const endpoint_token = properties.get('spotify.endpoint.token');
const redirect_uri = properties.get('spotify.redirect.uri');
const scopes = properties.get('spotify.scopes');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'Demo Spotify'
    });
});

/* Login Spotify home page. */
router.get('/login', (req, res, next) => {
    let oauth = {
        client_id: client_id,
        redirect_uri: redirect_uri,
        response_type: 'code',
        scope: scopes
    };
    let url = endpoint_authorize + '?' + qs.stringify(oauth);
    res.redirect(url);
});

/* Callback login spotify */
router.get('/callback', (req, res, next) => {
    var session = req.session;
    if (req.query.error === 'access_denied') {
        res.render('errors/access_denied');
    } else {
        rp({
            method: 'POST',
            uri: endpoint_token,
            form: {
                grant_type: 'authorization_code',
                code: req.query.code,
                redirect_uri: redirect_uri
            },
            auth: {
                'user': client_id,
                'pass': secret_id,
            }
        }).then((body) => {
            body = JSON.parse(body);
            session.spotify = {
                auth: body
            };
            res.redirect('/home');
        }).catch((err) => {
            var error = new Error('Error Authentication Spotify');
            error.status = err.statusCode;
            next(error);
        });
    }
});

router.get('/logout', (req, res, next) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;
