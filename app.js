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
  cookie: 'locale',
  directory: __dirname + '/locales'
});

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/assets'));
  app.use(express.static(path.join(__dirname, 'assets')));
  app.use(i18n.init);
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.all('/', routes.index);

require('./lib/irc')(io);

server.listen(app.get('port'), function(){
  console.log(i18n.__("ichat.io server is listening on port %s", app.get('port')));
});
