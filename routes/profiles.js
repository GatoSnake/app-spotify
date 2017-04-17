var express = require('express');
var request = require('request');
var rp = require('request-promise');
var PropertiesReader = require('properties-reader');

var router = express.Router();
var properties = PropertiesReader('properties.ini');

const endpoint_api = properties.get('spotify.endpoint.api.v1');

/* GET current user's profile */
router.get('/', function(req, res, next) {
    var session = req.session;
    rp({
        method: 'GET',
        uri: endpoint_api + '/me',
        auth: {
            bearer: session.spotify.auth.access_token
        }
    }).then((body) => {
        res.json(JSON.parse(body));
    }).catch((err) => {
        var error = new Error('Error API Spotify');
        error.status = err.statusCode;
        next(error);
    });
});

/* GET followed artist */
router.get('/following', function(req, res, next) {
    var session = req.session;
    rp({
        method: 'GET',
        uri: endpoint_api + '/me/following?type=artist',
        auth: {
            bearer: session.spotify.auth.access_token
        }
    }).then((body) => {
        res.json(JSON.parse(body));
    }).catch((err) => {
        var error = new Error('Error API Spotify');
        error.status = err.statusCode;
        next(error);
    });
});

/* Follow artirts or users */
router.put('/following', function(req, res, next) {
    res.send('');
});

/* Unfollow artirts or users */
router.delete('/following', function(req, res, next) {
    res.send('');
});

module.exports = router;
