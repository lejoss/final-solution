/**
 * Created by lejoss on 3/29/16.
 */


// Basic Setup
var express      = require('express');
var app          = express();
var bodyParser   = require('body-parser');
var path         = require('path');
var logger       = require('morgan');
var port         = process.env.PORT || 3000;
var routes;

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, '../client')));
app.use(bodyParser.json());

routes = require('./routes/index')(app);

app.listen(port, function() {
    console.log('=================================================================');
    console.log('╭∩╮（︶︿︶）╭∩╮ server running on localhost:3000 ╭∩╮（︶︿︶）╭∩╮ ');
    console.log('=================================================================');
});