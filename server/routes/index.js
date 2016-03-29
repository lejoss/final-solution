/**
 * Created by lejoss on 16/11/15.
 */
module.exports = function(app) {

    var request = require('superagent');

    // Get base path
    app.get('/', function(req, res) {
        res.redirect('/app/');
    });

    app.get('/api/clawfull/:rate', function(req, res, next) {
        var param = req.params.rate;
        var url = 'http://localhost:5000/clawfull/' + param;

        // SA requesting SIM-API
        request
            .get(url)
            .end(function(err, result) {
                if(result.status == 200) {
                    // sending response back to client
                    res.json(JSON.parse(result.text));
                } else {
                    // handle error cb here
                    console.log('WOOOT something is broken >,< ');
                }
            });
    });
};