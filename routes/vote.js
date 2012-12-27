/*
 * Defines routing for all vote related actions:
 * - show a QR-code and reset/open the corresponding vote
 * - save single answers returning from "clicker" deevices
 * - stop the vote 
 * - deliver results as histogram data for display purposes
*/

var collector = require('./voteCollector')
  , voteCollector = new collector.VoteCollector();

exports.showQrAndStart = function(req, res) {
  voteCollector.openVote(req.params.id);
  res.render('questionqr', { id: req.params.id });
};

exports.saveAnswer = function(req, res) {
	var vote = req.body.vote;
	voteCollector.saveAnswer(vote.id, vote.alternative);
	res.end("<html><body>Danke :-)</body></html>");
};

exports.stopVoteAndShowResult = function(req, res) {
  voteCollector.closeVote(req.params.id);
  res.render('result', { id: req.params.id });
};

exports.resultValues = function(req, res) {
	res.send(voteCollector.getResults(req.params.id));
};

