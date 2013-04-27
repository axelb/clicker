/*
 * Defines routing for all MC-vote related actions:
 * - show a QR-code and reset/open the corresponding vote
 * - save single answers returning from "clicker" devices
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
	var vote = req.body.vote
	  , status = voteCollector.saveAnswer(vote.id, vote.alternative);
	if(status !== 0) {
		res.send(404, 'Vote not open');
		res.end();
	} else {
		res.render('danke');
	}
};

exports.stopVoteAndShowResult = function(req, res) {
  voteCollector.closeVote(req.params.id);
  res.render('result', { id: req.params.id });
};

exports.resultValues = function(req, res) {
	res.send(voteCollector.getResults(req.params.id));
};

