/**
 * Created by lejoss on 16/11/15.
 */

var postgres   = require('pg');
var datasource = 'postgres://lejoss:123fenix@localhost/final-solution';

exports.useClient = function(success) {
    postgres.connect(datasource, function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }
        success(client);
    });
};