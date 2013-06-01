/* express-based server.
 */
var express = require('express')
    , question = require('./routes/question')
    , passport = require('passport')
    , localStrategy = require('passport-local').Strategy
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
    , logger = log4js.getLogger('server')
    , theOneAndOnlyUser = {name: "XXX", id: 4711};

log4js.configure('log4jsconfig.json');

/**
 * Configure passport for local strategy
 */
passport.use(new localStrategy(
  function(username, password, done) {
    /*User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });*/
      if(username === "XXX") {
          logger.debug("Login succeeded");
          return done(null, theOneAndOnlyUser);
      }
      return done(null, false);
  }
));
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    if(id === 4711) {
        done(null, theOneAndOnlyUser);
        return;
    }
    done(new Error('User ' + id + ' does not exist'), undefined);
});

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
                                   failureFlash: true })
);
/*
 Protection strategy:
 /list is a protected REST get-interface.
 Those getters /voteqr that start a vote are protected.
 There is no need to protect other RESTful getters.
 Posting questions definitely must be protected.
 Furthermore the possibility to start votes must be protected.
 */
app.get('/list', ensureAuthenticated, question.list);
app.get('/loggedInCheck', function (req, res) {res.end(JSON.stringify({status: req.isAuthenticated()}));});
app.post('/question', ensureAuthenticated, question.save);//Only accepts form-data; neue Frage; noch ohne id
app.put('/question/:id', question.save);//bestehende Frage; mit id
app.get('/question/:id', question.show);//Frage gerendert an einzelnen Teilnehmer zur Abstimmung ausliefern
app.get('/question/json/:id', question.asjson);//any kind of question returned here
app.get('/edit/:id', question.asjson);
app.get('/delete/:id', question.remove);
app.get('/image/:id', image.getImage);

app.get('/voteqr/MC/:id', ensureAuthenticated, mcvote.showQrAndStart);
app.get('/voteqr/SC/:id', ensureAuthenticated, mcvote.showQrAndStart);
app.get('/voteqr/Cloze/:id', ensureAuthenticated, clozevote.showQrAndStart);
app.get('/voteqr/Point/:id', ensureAuthenticated, pointvote.showQrAndStart);

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

