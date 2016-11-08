//Requires
var express = require('express'),
    http = require('http'),
    flash = require('connect-flash'),
    app = express(),
    bodyParser = require('body-parser'),
    favicon = require('serve-favicon'),
    morgan = require('morgan'),
    uuid = require('node-uuid'),
    config = require('./application/modules/Configuration');

//App set up
app.set('port', process.env.PORT || 3000);
app.set('environment', process.env.NODE_ENV || 'development');
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));
app.set('views', 'application/views');

// app.use(favicon(__dirname + '/public/assets/images/favicon.ico'));

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

//flash message
app.use(flash());

//Router
var nodeRouter = require('./application/routes/SiteRouter');
app.use('/', nodeRouter);

//start Server
var server = app.listen(app.get('port'), function() {
    console.log("Listening to port %s", server.address().port);
});

if (config.environment !== "development") {
    process.on('uncaughtException', function(err) {
        try {
            console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
            console.log('Caught exception:', err, err.stack);
            console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
        } catch (a) {}
    });
}
