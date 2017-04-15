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
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    res.clearCookie('expires_in');
    res.render('index', {
        title: 'Demo Spotify'
    });
});

/* Login Spotify home page. */
router.get('/login', (req, res, next) => {
    let oauth = {
        client_id: client_id,
        redirect_uri: redirect_uri,
        response_type: 'code'
    };
    let url = endpoint_authorize + '?' + qs.stringify(oauth);
    res.redirect(url);
});

router.get('/callback', (req, res, next) => {
    console.log(req.query);
    code = req.query.code;
    if (req.query.error === 'access_denied') {
        res.send(`Acceso denegado!`);
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
                res.cookie('access_token', body.access_token);
                res.cookie('refresh_token', body.refresh_token);
                res.cookie('expires_in', body.expires_in);
                res.redirect('/home');
            } else {
                //console.log(r);
                res.send(`Error ${r.statusCode}!`);
            }
        });
    }
});

module.exports = router;
