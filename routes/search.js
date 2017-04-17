var express = require('express');
var request = require('request');
var rp = require('request-promise');
var PropertiesReader = require('properties-reader');

var router = express.Router();
var properties = PropertiesReader('properties.ini');

const endpoint_api = properties.get('spotify.endpoint.api.v1');

/* Search for an album, artist, playlist or track */
router.get('/', function(req, res, next) {
    var session = req.session;
    rp({
        method: 'GET',
        uri: endpoint_api + '/search',
        auth: {
            bearer: session.spotify.auth.access_token
        },
        qs: {
            type: req.query.type === '' ? 'album,artist,playlist,track' : req.query.type,
            q: req.query.q,
            limit: req.query.limit === '' ? '' : req.query.limit
        }
    }).then((body) => {
        res.json(JSON.parse(body));
    }).catch((err) => {
        var error = new Error('Error API Spotify');
        error.status = err.statusCode;
        next(error);
    });
});

module.exports = router;
