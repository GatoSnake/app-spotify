var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var qs = require('querystring');
var PropertiesReader = require('properties-reader');

var router = express.Router();
var properties = PropertiesReader('properties.ini');

const client_id = properties.get('spotify.client.id');
const secret_id = properties.get('spotify.secret.id');
const endpoint_authorize = properties.get('spotify.endpoint.authorize');
const endpoint_token = properties.get('spotify.endpoint.token');
const redirect_uri = properties.get('spotify.redirect.uri');

/* GET home page. */
router.get('/', function(req, res, next) {
    var session = req.session;
    try {
        if (session.spotify) {
            res.redirect('/home');
        } else {
            res.render('index', {
                title: 'Demo Spotify'
            });
        }
    } catch (e) {
        console.log(e);
        session.destroy();
        res.redirect('/');
    }
});

/* Login Spotify home page. */
router.get('/login', (req, res, next) => {
    var session = req.session;
    try {
        if (session.spotify) {
            res.redirect('/home');
        } else {
            let oauth = {
                client_id: client_id,
                redirect_uri: redirect_uri,
                response_type: 'code'
            };
            let url = endpoint_authorize + '?' + qs.stringify(oauth);
            res.redirect(url);
        }
    } catch (e) {
        console.log(e);
        res.redirect('/');
    }
});

/* Callback login spotify */
router.get('/callback', (req, res, next) => {
    var session = req.session;
    if (req.query.error === 'access_denied') {
        res.render('errors/access_denied');
    } else {
        request.post(endpoint_token, {
            form: {
                grant_type: 'authorization_code',
                code: req.query.code,
                redirect_uri: redirect_uri
            },
            auth: {
                'user': client_id,
                'pass': secret_id,
            }
        }, (e, r, body) => {
            console.log(body);
            if (r.statusCode === 200) {
                body = JSON.parse(body);
                console.log(session);
                session.spotify = {
                    auth: body
                };
                res.redirect('/home');
            } else {
                //console.log(r);
                res.send(`Error ${r.statusCode}!`);
            }
        });
    }
});

router.get('/logout', (req, res, next) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;
