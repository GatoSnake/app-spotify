var express = require('express');
var request = require('request');
var qs = require('querystring');
var PropertiesReader = require('properties-reader');

var router = express.Router();
var properties = PropertiesReader('properties.ini');

const endpoint_api = properties.get('spotify.endpoint.api.v1');

/* GET home page. */
router.get('/', function(req, res, next) {
    //console.log(req.session);
    var session = req.session;
    if (session.spotify) {
        request.get(endpoint_api + '/me', {
            auth: {
                bearer: session.spotify.auth.access_token
            }
        }, (e, r, body) => {
            body = JSON.parse(body);
            //console.log(body);
            res.render('home', {
                username: body.display_name,
                img_user: body.images[0].url
            });
            //res.send(`Welcome ${body.display_name}`);
        });
    }else{
        res.redirect('/');
    }
});

module.exports = router;
