var express = require('express');
var request = require('request');
var qs = require('querystring');

var router = express.Router();

/* Search for an Item. */
router.get('/search', function(req, res, next) {
    let oauth = {
        client_id: client_id,
        redirect_uri: redirect_uri,
        response_type: 'code'
    };
    let url = endpoint_authorize + '?' + qs.stringify(oauth);
    console.log(url);
    res.redirect(url);
    // request.get(url, function (e, r, body) {
    //     //console.log(r);
    //     res.send(body);
    // });
});

module.exports = router;
