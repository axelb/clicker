/* express-based server.
*/
var express = require('express')
  , routes = require('./routes')
  , question = require('./routes/question')
  , vote = require('./routes/vote')
  , http = require('http')
  , path = require('path')
  , mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , app = express()
  , connection = mongoose.createConnection("mongodb://dl5mfx:tyre2hush7pal@ds043997.mongolab.com:43997/onlineresponse");

connection.on('error', function(error){console.log("Connection error: " + error)});

app.configure(function(){
  app.set('port', process.env.PORT || 8888);//process.env.PORT for deployment on heroku
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));// content of public is served statically
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/list', question.list);
app.put('/question/', question.save);//neue Frage; noch ohne id
app.get('/question/:id', question.show);//Frage an einzelnen Teilnehmer zur Abstimmung ausliefern
app.get('/voteqr/:id', vote.showQrAndStart);
app.put('/answer/:id', vote.saveAnswer);//single answer returned
app.get('/result/:id', vote.stopVoteAndShowResult);
app.get('/results/:id', vote.resultValues);//JSON data of result's historgam data

http.createServer(app).listen(app.get('port'), function() {
  console.log("Express server listening on port " + app.get('port'));
});
