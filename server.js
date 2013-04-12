/* express-based server.
 */
var express = require('express')
    , routes = require('./routes')
    , question = require('./routes/question')
    , image = require('./routes/image')
    , vote = require('./routes/vote')
    , http = require('http')
    , path = require('path')
    , app = express()
    , log4js = require('log4js')
    , logger = log4js.getLogger('server');

log4js.configure('log4jsconfig.json');

app.configure(function () {
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

app.configure('development', function () {
    app.use(express.errorHandler());
});

app.get('/list', question.list);
app.post('/question', question.save);//Only accepts form-data; neue Frage; noch ohne id
app.put('/question/:id', question.save);//bestehende Frage; mit id
app.get('/question/:id', question.show);//Frage gerendert an einzelnen Teilnehmer zur Abstimmung ausliefern
app.get('/question/json/:id', question.asjson);
app.get('/edit/:id', question.asjson);
app.get('/delete/:id', question.remove);
app.get('/image/:id', image.getImage);

app.get('/voteqr/:id', vote.showQrAndStart);
app.put('/saveAnswer', vote.saveAnswer);//single answer returned
app.get('/result/:id', vote.stopVoteAndShowResult);
app.get('/results/:id', vote.resultValues);//JSON data of result's historgam data

http.createServer(app).listen(app.get('port'), function () {
    logger.debug("Express server listening on port " + app.get('port'));
});
