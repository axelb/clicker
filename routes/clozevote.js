/*
 * Defines routing for all cloze-vote related actions:
 * - show a QR-code and reset/open the corresponding vote
 * - save single answers returning from "clicker" devices
 * - stop the vote
 * - deliver results as table to teacher
*/

var collector = require('./clozeCollector')
  , clozeCollector = new collector.ClozeCollector();

exports.showQrAndStart = function(req, res) {
  clozeCollector.openVote(req.params.id);
  res.render('questionqr', { id: req.params.id, type: 'cloze' });
};

exports.saveAnswer = function(req, res) {
	var vote = req.body.vote
	  , status = clozeCollector.saveAnswer(vote.id, vote.results);
	if(status !== 0) {
		res.send(404, 'Vote not open');
		res.end();
	} else {
		res.render('danke');
	}
};

exports.stopVoteAndShowResult = function(req, res) {
  clozeCollector.closeVote(req.params.id);
  res.render('clozeresult', { id: req.params.id });
};

exports.resultValues = function(req, res) {
	res.send(clozeCollector.getResultsAsJSON(req.params.id));
};
