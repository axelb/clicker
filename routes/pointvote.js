/*
 * Defines routing for all point-and-click-vote related actions:
 * - show a QR-code and reset/open the corresponding vote
 * - save single answers returning from "clicker" devices
 * - stop the vote
 * - deliver results to to teacher
 */

var config = require('../public/js/config')
    , collector = require('./pointCollector')
    , pointCollector = new collector.PointCollector();

exports.showQrAndStart = function(req, res) {
    pointCollector.openVote(req.params.id);
    res.render('questionqr', { id: req.params.id, type: config.questionTypes().Cloze.name });
};

exports.saveAnswer = function(req, res) {
    var vote = req.body.vote
        , status = pointCollector.saveAnswer(vote.id, vote.results);
    if(status !== 0) {
        res.send(404, 'Vote not open');
        res.end();
    } else {
        res.render('danke');
    }
};

exports.stopVoteAndShowResult = function(req, res) {
    pointCollector.closeVote(req.params.id);
    res.render('pointresult', { id: req.params.id });
};

exports.resultValues = function(req, res) {
    res.send(pointCollector.getResultsAsJSON(req.params.id));
};
