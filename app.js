var express = require('express')
  , i18n = require("i18n")
  , routes = require('./routes')
  , http = require('http')
  , path = require('path');

var app = express()
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);

// Load Config
require('./config');

i18n.configure({
  locales: ['en', 'pt_BR'],
  defaultLocale: 'en',
  directory: __dirname + '/locales'
});

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/assets'));
  app.use(express.static(path.join(__dirname, 'assets')));
  app.use(function(req, res, next) {
    res.locals.__ = res.__ = function() {
      return i18n.__.apply(req, arguments);
    };
    next();
  });
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.all('/', routes.index);

require('./lib/irc')(io);

server.listen(app.get('port'), function(){
  console.log("ichat.io server is listening on port " + app.get('port'));
});
