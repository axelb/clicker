/*
 * Defines routing for all vote related actions:
 * - show a QR-code and reset/open the corresponding vote
 * - save single answers returning from "clicker" deevices
 * - stop the vote 
 * - deliver results as histogram data for display purposes
*/

var collector = require('./voteCollector');

var voteCollector = new collector.VoteCollector();

exports.showQrAndStart = function(req, res) {
  voteCollector.openVote(req.params.id);
  res.render('questionqr', { id: req.params.id });
};

exports.saveAnswer = function(req, res) {
	voteCollector.saveAnswer();
};

exports.stopVoteAndShowResult = function(req, res) {
  voteCollector.closeVote(req.params.id);
  res.render('result', { id: req.params.id });
};

exports.resultValues = function(req, res) {
	res.json(voteCollector.getResults(req.params.id));
};

