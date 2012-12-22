
var express = require('express')
  , routes = require('./routes')
  , vote = require('./routes/vote')
  , voteqr = require('./routes/voteqr')
  , http = require('http')
  , path = require('path')
  , app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 8888);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/:id', routes.index);
app.get('/voteqr/:id', voteqr.show);
app.get('/vote/:id', vote.show);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
