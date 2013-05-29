/* express-based server.
 */
var express = require('express')
    , question = require('./routes/question')
    , image = require('./routes/image')
    , mongo = require('./routes/mongo')
    , mcvote = require('./routes/mcvote')
    , clozevote = require('./routes/clozevote')
    , pointvote = require('./routes/pointvote')
    , config = require('./public/js/config')
    , questionTypes = config.questionTypes()
    , questionType
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
    app.use(function(req, res, next) {
        if (!mongo.health()) {
            res.set('Content-Type', 'text/html');
            res.send(new Buffer('ERROR!'));
        } else {
            next();
        }
    });
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
app.get('/question/json/:id', question.asjson);//any kind of question returned here
app.get('/edit/:id', question.asjson);
app.get('/delete/:id', question.remove);
app.get('/image/:id', image.getImage);

app.get('/voteqr/MC/:id', mcvote.showQrAndStart);
app.get('/voteqr/SC/:id', mcvote.showQrAndStart);
app.get('/voteqr/Cloze/:id', clozevote.showQrAndStart);
app.get('/voteqr/Point/:id', pointvote.showQrAndStart);

app.put('/saveAnswer/mc', mcvote.saveAnswer);//single answer returned
app.put('/saveAnswer/cloze', clozevote.saveAnswer);
app.put('/saveAnswer/point', pointvote.saveAnswer);

app.get('/results/mc/:id', mcvote.resultValues);//JSON data of result's histogram data
app.get('/results/Point/:id', pointvote.resultValues);//JSON data of result's coordinate collected so far
app.get('/results/cloze/:id', clozevote.resultValues);//JSON data of result's table data

// TODO: generify like that:
/*for(questionType in questionTypes) {
    app.get('/voteqr/' + questionTypes[questionType].name + '/:id', );
} */

http.createServer(app).listen(app.get('port'), function () {
    logger.debug("Express server listening on port " + app.get('port'));
});
