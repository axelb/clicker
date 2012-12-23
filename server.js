
var express = require('express')
  , routes = require('./routes')
  , vote = require('./routes/vote')
  , voteqr = require('./routes/voteqr')
  , http = require('http')
  , path = require('path')
  , mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , app = express();

  // dl5mfx  tyre2hush7pal

var Alternative = new Schema({
    title: { type: String, required: true, trim: true }
});

var voteSchema = new Schema({
    question      : { type: String, required: true, trim: true }
  , alternatives  : [Alternative]
});

var connection = mongoose.createConnection("mongodb://dl5mfx:tyre2hush7pal@ds043997.mongolab.com:43997/onlineresponse");
connection.on('error', function(error){console.log("Connection error: " + error)});
/*
var Vote = connection.model('Vote', voteSchema)
  , woodVote = new Vote({question: "How much wood?", alternatives: [{title: "One"}, {title: "Two"}]});
woodVote.save(function(b){console.log(b);});
*/
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

//app.get('/:id', routes.index);
app.get('/voteqr/:id', voteqr.show);
app.get('/vote/:id', vote.show);
app.put('/vote', vote.save);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
