/*
 * Defines routing for all point-and-click-vote related actions:
 * - show a QR-code and reset/open the corresponding vote
 * - save single answers returning from "clicker" devices
 * - stop the vote
 * - deliver results to to teacher
 */

'use strict';

var config = require('../public/js/config'),
    collector = require('./pointCollector'),
    pointCollector = new collector.PointCollector();

exports.showQrAndStart = function(req, res) {
    pointCollector.openVote(req.params.id);
    res.sendStatus(200);
};

exports.saveAnswer = function(req, res) {
    var vote = req.body.vote,
        status;
    status = pointCollector.saveAnswer(vote.id, vote.results);
    if(status !== 0) {
        res.render('noVoteError');
    } else {
        res.render('danke');
    }
};

exports.stopVoteAndShowResult = function(req, res) {
    pointCollector.closeVote(req.params.id);
    res.redirect('/#/result/Point/' + req.params.id);
};

exports.resultValues = function(req, res) {
    res.send(pointCollector.getResultsAsJSON(req.params.id));
};
