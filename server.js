/* express-based server.
 */
var express = require('express'),
    user = require('./routes/user'),
    question = require('./routes/question'),
    passport = require('passport'),
    localStrategy = require('passport-local').Strategy,
    image = require('./routes/image'),
    mongo = require('./routes/mongo'),
    mcvote = require('./routes/mcvote'),
    clozevote = require('./routes/clozevote'),
    pointvote = require('./routes/pointvote'),
    config = require('./public/js/config'),
    questionTypes = config.questionTypes(),
    http = require('http'),
    path = require('path'),
    app = express(),
    log4js = require('log4js'),
    logger = log4js.getLogger('server');

log4js.configure('log4jsconfig.json');

/**
 * Configure passport for local strategy
 */
passport.use(new localStrategy(user.verifier));
passport.serializeUser(user.serializer);
passport.deserializeUser(user.deserializer);

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect(401, '/login.html');
}

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
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.session({ secret: 'bbwuop' }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));// content of public is served statically
});

app.configure('development', function () {
    app.use(express.errorHandler());
});

app.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/',
                                   failureFlash: false })
);
/*
 Protection strategy:
 /list is a protected REST get-interface.
 Those getters /voteqr that start a vote are protected.
 Deletion is protected as well.
 There is no need to protect other RESTful getters.
 Posting/putting new/modified questions definitely must be protected.
 Furthermore the possibility to start votes must be protected.
 */
app.get('/loggedInCheck', user.loggedInCheck);//tell me if I am authenticated.
app.get('/logout', user.logout);
app.get('/list', ensureAuthenticated, question.list);
app.get('/delete/:id', ensureAuthenticated, question.remove);
app.post('/question', ensureAuthenticated, question.save);//Only accepts form-data; neue Frage; noch ohne id
app.put('/question/:id', ensureAuthenticated, question.save);//bestehende Frage; mit id
app.get('/question/:id', question.show);//Frage gerendert an einzelnen Teilnehmer zur Abstimmung ausliefern
app.get('/question/json/:id', question.asjson);//any kind of question returned here
app.get('/edit/:id', question.asjson);
app.get('/image/:id', image.getImage);

app.get('/voteqr/MC/:id', ensureAuthenticated, mcvote.showQrAndStart);
app.get('/voteqr/SC/:id', ensureAuthenticated, mcvote.showQrAndStart);
app.get('/voteqr/Cloze/:id', ensureAuthenticated, clozevote.showQrAndStart);
app.get('/voteqr/Point/:id', ensureAuthenticated, pointvote.showQrAndStart);

app.post('/saveAnswer/mc', mcvote.saveAnswer);//single answer returned
app.post('/saveAnswer/cloze', clozevote.saveAnswer);
app.post('/saveAnswer/point', pointvote.saveAnswer);

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

