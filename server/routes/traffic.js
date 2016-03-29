/**
 * Created by lejoss on 16/11/15.
 */

var express      = require('express');
var trafficModel = require('../models/traffic');
var router       = express.Router();


router.post('/app/traffic-model', function(req, res) {
    var entry = req.body;
    trafficModel.createDriverEntry(entry, function (result) {
        req.body.id = result.rows[0].id;
        res.status(201);
        res.send(req.body);
    })
});

module.exports = router;